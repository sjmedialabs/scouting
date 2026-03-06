"use client";

import { useRef, useState, useEffect, use } from "react";
import {
  Phone,
  Video,
  Search,
  Paperclip,
  Send,
  Camera,
  Check,
  CheckCheck,
  FileText,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ReportContentModal from "@/components/report-modal";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useRouter,useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { authFetch } from "@/lib/auth-fetch";
import { io } from "socket.io-client"

type Attachment = {
  id: string;
  type: "image" | "file";
  url: string;
  name?: string;
};

type MessageStatus = "sent" | "delivered" | "read";

type Message = {
  id: string;
  sender: "me" | "them";
  text?: string;
  time: string;
  status: MessageStatus;
  attachments?: Attachment[];
};

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  category?: string;
  online?: boolean;
};

/* MOCK DATA */

const conversations: Conversation[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://i.pravatar.cc/100?img=12",
    lastMessage: "See you later, I’ll let you know.",
    time: "09:45",
    category: "E-commerce",
    online: true,
  },
  {
    id: "2",
    name: "Creative Minds",
    avatar: "https://i.pravatar.cc/100?img=32",
    lastMessage: "Marcus Miller: Do you have time for a call?",
    time: "10:25",
    category: "Mobile App",
  },
  {
    id: "3",
    name: "Anna Roberts",
    avatar: "https://i.pravatar.cc/100?img=45",
    lastMessage: "I’ll confirm the time tomorrow.",
    time: "12:25",
    category: "Web Development",
    online: true,
  },
  {
    id: "4",
    name: "Charles Miller",
    avatar: "https://i.pravatar.cc/100?img=22",
    lastMessage: "Thanks for the document, everything looks good.",
    time: "11:55",
    unreadCount: 20,
  },
];

const initialMessages: Message[] = [
  {
    id: "m1",
    sender: "them",
    text: "Hey Emma! I was thinking about the new app interface. Dark theme?",
    time: "09:20",
    status: "read",
  },
  {
    id: "m2",
    sender: "me",
    text: "Dark themes feel modern. Accessibility & contrast are key.",
    time: "09:20",
    status: "read",
  },
  {
    id: "m3",
    sender: "them",
    text: "I’ll test variations with different contrasts and highlights.",
    time: "09:21",
    status: "delivered",
    attachments: [
      {
        id: "a1",
        type: "image",
        url: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      },
    ],
  },
];

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams=useSearchParams();
  const clientId=searchParams.get("clientId");
  const agencyId=searchParams.get("agencyId")
  console.log("Client Id recived through the URL::::",clientId)
  console.log("Agency Id through the Url is:::",agencyId)
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const [dynamicConversation, setDynamicConversation] = useState<
    Conversation[]
  >([]);
  const [filteredDynamicConversation, setFileteredDynamicConversation] =
    useState<Conversation[]>([]);
  const [dynamicActiveConversation, setDynamicActiveConversation] = useState<
    any | null
  >(null);
  const [dynamicMessages, setDynamicMessages] = useState<Message[]>([]);
  const [messageRecieverId, setMessageRecieverId] = useState();
  const [totalUnreadMessagesCount, setTotalUnreadMessagesCount] = useState(0);

  const [resLoading, setResLoading] = useState(false);
  const [chatLaoding, setChatLoading] = useState(false);
  const [sendMsgLoading, setSendMsgLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const socketRef = useRef<any>(null)

useEffect(() => {
  if (socketRef.current) return

  socketRef.current = io(
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
    {
      path: "/socket.io",
      transports: ["websocket"],
    }
  )

  socketRef.current.on("connect", () => {
    console.log("✅ Socket connected:", socketRef.current.id)
  })

  return () => {
    socketRef.current.disconnect()
    socketRef.current = null
  }
}, [])


  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const res = await authFetch("/api/chat/conversation");
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      console.log("Fetched Conversations:::::", data.conversations);
      const allConversations = data.conversations || [];

      setDynamicConversation(allConversations);
      setFileteredDynamicConversation(allConversations);

      let totalUnreadCount = 0;
      allConversations.map((eachItem: any) => {
        totalUnreadCount += eachItem.unreadCount;
      });

      setTotalUnreadMessagesCount(totalUnreadCount);

      // FIX: Pass the specific ID and the data directly
      if (allConversations.length > 0) {
        if(clientId && agencyId){
          console.log("Entered To If condition in the----")
          const filteredConv = allConversations.find((eachItem) =>
            eachItem.participantsAre.includes(clientId) &&
            eachItem.participantsAre.includes(agencyId)
          );
           console.log("If condition Filtered Conv is:::",filteredConv)
          setDynamicActiveConversation(filteredConv)
         
          await fetchMessages(filteredConv.conversationId)

        }else{
          console.log("Else Block Entered")
          const firstConv = allConversations[0];
        // Set the active state immediately with the object we already have
        setDynamicActiveConversation(firstConv);
        // Fetch messages for this specific ID
        await fetchMessages(firstConv.conversationId);
        }
      }
    } catch (err) {
      console.log(err);
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login");
    }
    if (user && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);
useEffect(() => {
  const socket = socketRef.current
  if (!socket) return
  if (!dynamicActiveConversation?.conversationId) return

  socket.emit(
    "join-conversation",
    dynamicActiveConversation.conversationId
  )

  const handler = (message: any) => {
    setDynamicMessages((prev) => [...prev, message])
  }

  socket.on("receive-message", handler)

  return () => {
    socket.off("receive-message", handler)
  }
}, [dynamicActiveConversation?.conversationId])




  const sendMessage = async () => {
    if (!messageInput.trim() && !uplodedUrl.url.trim()) return;
    console.log("Sending Msg:::::");

    // setMessagesByConversation((prev) => ({
    //   ...prev,
    //   [activeConversationId]: [
    //     ...(prev[activeConversationId] || []),
    //     {
    //       id: crypto.randomUUID(),
    //       sender: "me",
    //       text: messageInput,
    //       time: "now",
    //       status: "sent",
    //     },
    //   ],
    // }))
    let recieverId =
      (dynamicActiveConversation || []).participantsAre[0] === user.id
        ? (dynamicActiveConversation || []).participantsAre[1]
        : (dynamicActiveConversation || []).participantsAre[0];
    console.log("Reciever Id is::::::::", recieverId);
    setSendMsgLoading(true);
    const payload = {
      conversationId: dynamicActiveConversation.conversationId,
      senderType: "PROVIDER",
      receiverId: recieverId,
    };
    if (uplodedUrl.url.trim()) {
      ((payload.attachments = [uplodedUrl.url]),
        (payload.messageType = uplodedUrl.type));
    }
    if (messageInput.trim()) {
      payload.content = messageInput;
    }
    console.log("Message Payload is ::::::", payload);
    try {
      const res = await authFetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const { message } = await res.json()
      // await fetchMessages(dynamicActiveConversation.conversationId);
       console.log('Send Message Response::::::',message)

  //  REAL-TIME UPDATE
      socketRef.current.emit("send-message", message)
        setUploadedUrl({
          url:"",
          type:"",
        });
     console.log("Response of the send message::::",await res.json);
      setUploadedUrl({
        url: "",
        type: "",
      });
      console.log("Response of the send message::::", await res.json);
    } catch (err) {
      console.log("Failed To post message", err);
    } finally {
      setSendMsgLoading(false);
    }

    setMessageInput("");
  };

  const handleAttachment = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    setMessagesByConversation((prev) => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] || []),
        {
          id: crypto.randomUUID(),
          sender: "me",
          time: "now",
          status: "sent",
          attachments: [
            {
              id: crypto.randomUUID(),
              type: file.type.startsWith("image") ? "image" : "file",
              url,
              name: file.name,
            },
          ],
        },
      ],
    }));
  };

  const [activeConversationId, setActiveConversationId] = useState(
    conversations[0].id,
  );

  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, Message[]>
  >({
    "1": initialMessages,
  });

  const messages: Message[] =
    messagesByConversation[activeConversationId] || [];

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  )!;

  const StatusIcon = ({ status }: { status: MessageStatus }) => {
    if (status === "sent") return <Check className="h-3 w-3" />;
    if (status === "delivered") return <CheckCheck className="h-3 w-3" />;
    return <CheckCheck className="h-3 w-3 text-blue-600" />;
  };

  const formatedTime = (recivedTime: String) => {
    const timestamp = recivedTime;
    const date = new Date(timestamp);

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // console.log(time); // Output: "10:36 AM" (depending on your timezone)
    return time;
  };

  // Helper to just fetch messages
  const fetchMessages = async (id: string) => {
    setChatLoading(true);
    try {
      const res = await authFetch(`/api/chat/message/${id}`);
      const readRes = await authFetch(`/api/chat/read`, {
        method: "PATCH",
        headers: {
          "Context-Type": "application/json",
        },
        body: JSON.stringify({ conversationId: id }),
      });
      if (!res.ok || !readRes) throw new Error();
      const data = await res.json();
      setDynamicMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setChatLoading(false);
    }
  };

  // Updated click handler
  const handleClickedConversation = async (recievdId: string) => {
    const found = dynamicConversation.find(
      (c: any) => c.conversationId === recievdId,
    );
    if (found) {
      setDynamicActiveConversation(found);

      let tempCount = 0;
      setDynamicConversation((prev = []) =>
        prev.map((item) => {
          if (item.conversationId === found.conversationId) {
            tempCount = item.unreadCount;
            return { ...item, unreadCount: 0 };
          }
          return item;
        }),
      );
      setTotalUnreadMessagesCount((prev) => prev - tempCount);

      await fetchMessages(recievdId);
    }
  };

  //----------------------------------attachements handle ----------------------
  const [uploading, setUploading] = useState(false);
  const [uplodedUrl, setUploadedUrl] = useState({
    url: "",
    type: "",
  });

  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = ["image/", "application/pdf"];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size validation
    if (file.size > MAX_SIZE) {
      alert("File size must be less than 20MB");
      return;
    }

    // Type validation
    const isValidType = ALLOWED_TYPES.some((type) =>
      file.type.startsWith(type),
    );

    if (!isValidType) {
      alert("Only images and PDF files are allowed");
      return;
    }

    const fileCategory = file.type.startsWith("image/") ? "image" : "file";

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      // ✅ Send hosted URL back to parent

      console.log("Hosted attachement url is:::::", data.url);
      setUploadedUrl({
        url: data.url,
        type: fileCategory.toUpperCase(),
      });
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // to download thge image or file

  // when the user click on the file or image in the chat
  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = ""; // browser will infer filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("Filtered Conversatoions are::::::", filteredDynamicConversation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custum-class">
          Messages
        </h1>
        <p className="text-gray-500 text-xl">
          Manage your conversations and project inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 min-h-[100vh]">
        {/* LEFT SIDEBAR */}

        <Card className="rounded-2xl p-4 bg-white">
          <div className="h-4">
            <h3 className="font-semibold text-2xl mb-3">
              Messages{" "}
              <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {totalUnreadMessagesCount}
              </span>
            </h3>
          </div>

          <div className="relative mb-4 h-2 bg-white">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9 rounded-full bg-gray-100"
              onChange={(e) => {
                setFileteredDynamicConversation(() =>
                  dynamicConversation.filter((eachItem: any) =>
                    eachItem.participant.name
                      .trim()
                      .toLowerCase()
                      .includes(e.target.value.trim().toLowerCase()),
                  ),
                );
              }}
            />
          </div>

          {(filteredDynamicConversation || []).length != 0 ? (
            <div className="space-y-2">
              {filteredDynamicConversation.map((c) => (
                <div
                  key={c.conversationId}
                  // onClick={() => {
                  //   setActiveConversationId(c.id)
                  //   c.unreadCount = 0
                  // }}
                  onClick={() => handleClickedConversation(c.conversationId)}
                  className={clsx(
                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition",
                    dynamicActiveConversation?.conversationId ===
                      c.conversationId
                      ? "bg-blue-50"
                      : "hover:bg-gray-100",
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={
                        c.participant?.image ||
                        "https://i.pravatar.cc/100?img=12"
                      }
                      className="h-10 w-10 rounded-full"
                    />
                    {c?.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold truncate">
                        {c.participant.name}
                      </p>
                      {c?.lastMessageAt && (
                        <span className="text-xs text-gray-400">
                          {formatedTime(c.lastMessageAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {c.lastMessage}
                      </p>

                      {c.category ? (
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                          {c.category}
                        </span>
                      ) : c.unreadCount ? (
                        <span className="text-[11px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          {c.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mt-10">
                No Conversations Started yet
              </p>
            </div>
          )}
        </Card>

        {/* CHAT PANEL */}
        {!resLoading &&
        !failed &&
        (dynamicActiveConversation || []).length !== 0 ? (
          <Card className="rounded-2xl flex flex-col bg-white border-0 shadow-none">
            <div className="flex items-start justify-between bg-[#f9f9f9] px-6 py-4  border-b">
              <div className="flex items-center gap-3">
                <img
                  src={
                    dynamicActiveConversation.participant.image ||
                    "https://i.pravatar.cc/100?img=32"
                  }
                  className="h-9 w-9 rounded-full"
                />
                <div>
                  <p className="font-medium">
                    {dynamicActiveConversation.participant.name}
                  </p>
                  {/* <p className="text-xs text-gray-500">@mary_johnson</p> */}
                </div>
              </div>
              <div className="flex gap-10 items-center">
                <Phone className="h-5 w-5 text-blue-600" />
                <Video className="h-5 w-5 text-blue-600" />
                {/* <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full">
                  Active
                </span> */}
                <Button onClick={() => setOpen(true)} className="text-xs bg-red-500 text-white px-3 py-1 rounded-full">Report</Button>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
              {!chatLaoding && (dynamicMessages || []).length != 0 ? (
                <div>
                  {dynamicMessages.map((msg: Message) => (
                    <div
                      key={msg.id}
                      className={clsx(
                        "flex",
                        msg.senderId === user?.id
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div className="max-w-[70%]">
                        <div
                          className={clsx(
                            "rounded-2xl px-4 py-3 text-sm",
                            msg.sender === "me" ? "bg-blue-100" : "bg-gray-100",
                          )}
                        >
                          {msg.attachments?.length > 0 && (
                            <div
                              onClick={() => handleDownload(msg.attachments[0])}
                            >
                              {msg.messageType.toLowerCase() === "image" ? (
                                <img
                                  src={msg.attachments[0]}
                                  className="rounded-lg max-h-40"
                                />
                              ) : (
                                <div className="flex items-center gap-2 text-xs w-[40px] h-[40px] bg-white p-2 rounded-lg">
                                  <FileText className="h-10 w-10" />
                                  {/* {msg.attachments[0]} */}
                                </div>
                              )}
                            </div>
                          )}
                          {msg.content}
                        </div>

                        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mt-1">
                          {/* {msg.senderId === user?.id && (
                              <StatusIcon status={false} />
                            )} */}
                          {/* {
                              msg.isRead?<CheckCheck color="blue" size={16}/>:<Check size={16}/>
                            } */}
                          {msg.senderId === user?.id && (
                            <div>
                              {msg.isRead ? (
                                <CheckCheck color="blue" size={16} />
                              ) : (
                                <Check size={16} />
                              )}
                            </div>
                          )}
                          {formatedTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  {chatLaoding && (
                    <p className="text-gray-500 my-10">Loading...</p>
                  )}
                  {/* {
                    (!chatLaoding && dynamicMessages || []).length===0 &&(
                      <p className="text-gray-500 my-10">No Messages At...</p>
                    )
                  } */}
                </div>
              )}
              {!chatLaoding && (dynamicMessages || []).length === 0 && (
                <div className="text-center">
                  <p className="text-gray-500 my-10">No Messages Yet</p>
                </div>
              )}

              {/* {typing && (
              <p className="text-xs text-gray-400">Typing…</p>
            )} */}
            </div>

            <div className="px-6 py-4 border-t">
              <div className="mb-2">
                {uploading && <span>Uploading...</span>}
                {uplodedUrl.url && (
                  <div>
                    {uplodedUrl.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={uplodedUrl.url}
                        alt="preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <a href={uplodedUrl.url} target="_blank">
                        View Uploaded File
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                <div>
                  <Paperclip
                    className="h-5 w-5 text-blue-600 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  // onChange={(e) =>
                  //   handleAttachment(e.target.files)
                  // }
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  onFocus={() => setTyping(true)}
                  onBlur={() => setTyping(false)}
                  placeholder="Message"
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
                <Camera className="h-5 w-5 text-blue-600" />
                {sendMsgLoading && (
                  <p className="text-gray-300 text-sm">sending...</p>
                )}
                <button onClick={sendMessage} disabled={sendMsgLoading}>
                  <Send className="h-5 w-5 text-blue-600 cursor-pointer" />
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 mt-10">Click on any conversation</p>
          </div>
        )}
      </div>

      {/*Modal for the report */}
            {
              open &&(
                <ReportContentModal
                open={open}
                onClose={() => setOpen(false)}
                reportedTo={`${filteredDynamicConversation[0].participantsAre[0]===user.id?
                filteredDynamicConversation[0].participantsAre[1]
                :
                filteredDynamicConversation[0].participantsAre[0]}`}
              />
              )
            }
    </div>
  );
}
