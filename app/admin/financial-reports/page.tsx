"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
} from "lucide-react";
import { User } from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";



/* --------------------------------------------------
   LOCAL MOCK DATA (UI ONLY — backend-ready)
-------------------------------------------------- */

const mockMRRTable = [
  { month: "Jan", mrr: 45000, arr: 540000, churn: 3.2, ltv: 8500 },
  { month: "Feb", mrr: 52000, arr: 624000, churn: 2.8, ltv: 9200 },
  { month: "Mar", mrr: 68000, arr: 816000, churn: 1.75, ltv: 10100 },
  { month: "Apr", mrr: 82000, arr: 984000, churn: 1.9, ltv: 11200 },
  { month: "May", mrr: 95000, arr: 1140000, churn: 2.4, ltv: 12400 },
];

const mockSummary = {
  totalRevenue: 1140000,
  totalExpenses: 420000,
  netProfit: 720000,
};

const mockQuarterly = [
  {
    quarter: "Q1 2024",
    revenue: 180000,
    expenses: 92000,
    net: 88000,
  },
  {
    quarter: "Q2 2024",
    revenue: 270000,
    expenses: 135000,
    net: 135000,
  },
];

const mockYearly = [
  {
    year: "2023",
    revenue: 920000,
    expenses: 510000,
    profit: 410000,
  },
  {
    year: "2024",
    revenue: 1140000,
    expenses: 420000,
    profit: 720000,
  },
];

export default function FinancialReportsPage() {
  const [summary] = useState(mockSummary);
  const [quarters] = useState(mockQuarterly);
  const [yearly] = useState(mockYearly);

   const[resLoading,setResLoading]=useState(false);
    const[failed,setFailed]=useState(false)
  
    const[users,setUsers]=useState<User[]>([]);
    const[revenue,setRevenue]=useState([]);
    const userMap = new Map(
  users.map(user => [user._id.toString(), user])
);


    const MONTHS = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    // const selectedYear = 2026;
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const YEARS = Array.from(
      { length: 6 }, // 1 future + current + 4 past (adjustable)
      (_, i) => currentYear + 1 - i
    );




     const loadData=async ()=>{
          setResLoading(true);
          setFailed(false);
          try{
            const[usersRes,paymentRes]=await Promise.all([
              authFetch("/api/users"),
              authFetch("/api/payment"),
              
            ])
            if(!usersRes.ok || !paymentRes.ok) throw new Error();
            const userData=await usersRes.json();
            const  paymentData=await paymentRes.json();
            // const subscriptionData=await subscriptionRes.json();
      
            setUsers(userData.users);
            setRevenue(paymentData?.data);
            // setSubscriptions(subscriptionData);
       
      
          }catch(error){
            console.log('Failed to fetch the data:::',error)
          }finally{
            setResLoading(false);
          }
        }
        useEffect(()=>{
          loadData()
        },[])

        const getMonthRangeUTC = (year, monthIndex) => {
          const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
          const end = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));
          return { start, end };
        };

        const inferBillingCycle = (
        start: string | Date,
        end: string | Date
      ): "Yearly" | "Monthly" => {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        const diffInDays =
          (endTime - startTime) / (1000 * 60 * 60 * 24);

        if (diffInDays >= 360) return "Yearly";

        return "Monthly";
      };


        const getMonthlyAmountFromPayment = (payment) => {
          const user = userMap.get(payment.userId.toString());

          let billingCycle = user?.billingCycle;

          // 🔁 fallback inference
          if (!billingCycle) {
            billingCycle = inferBillingCycle(
              payment.subscriptionStartDate,
              payment.subscriptionEndDate
            );
          }

          if (billingCycle === "Yearly") {
            return Math.round(payment.amount / 12);
          }

          return payment.amount;
        };


        const calculateMRR = (payments, year, monthIndex) => {
          const { start: monthStart, end: monthEnd } =
            getMonthRangeUTC(year, monthIndex);

          return payments
            .filter(p => {
              if (p.status !== "success") return false;

              const start = new Date(p.subscriptionStartDate);
              const end = new Date(p.subscriptionEndDate);

              return start <= monthEnd && end >= monthStart;
            })
            .reduce((sum, p) => {
              return sum + getMonthlyAmountFromPayment(p);
            }, 0);
        };




      const getActiveUsersAtStart = (payments, year, monthIndex) => {
        const { start: monthStart } =
          getMonthRangeUTC(year, monthIndex);

        return new Set(
          payments
            .filter(p => {
              if (p.status !== "success") return false;

              const start = new Date(p.subscriptionStartDate);
              const end = new Date(p.subscriptionEndDate);

              return start <= monthStart && end >= monthStart;
            })
            .map(p => p.userId.toString())
        );
      };


     const getChurnedUsers = (payments, year, monthIndex) => {
      const { start: monthStart, end: monthEnd } =
        getMonthRangeUTC(year, monthIndex);

      return new Set(
        payments
          .filter(p => {
            if (p.status !== "success") return false;

            const end = new Date(p.subscriptionEndDate);
            if (end < monthStart || end > monthEnd) return false;

            const hasRenewal = payments.some(next =>
              next.userId.toString() === p.userId.toString() &&
              new Date(next.subscriptionStartDate) > end
            );

            return !hasRenewal;
          })
          .map(p => p.userId.toString())
      );
    };

      const calculateChurnRate = (
        activeUsersAtStart,
        churnedUsers
      ) => {
        if (activeUsersAtStart.size === 0) return 0;
        return Number(
          ((churnedUsers.size / activeUsersAtStart.size) * 100).toFixed(2)
        );
      };

      const calculateARPU = (mrr, activeUsersAtStart) => {
        if (activeUsersAtStart.size === 0) return 0;
        return Math.round(mrr / activeUsersAtStart.size);
      };

      const calculateLTV = (arpu, churnRate) => {
        if (churnRate === 0) return 0;
        return Math.round(arpu / (churnRate / 100));
      };

      const calculateSaasMetricsByYear = (payments, year) => {
      return MONTHS.map((month, index) => {
        const mrr = calculateMRR(payments, year, index);

        const activeUsersAtStart =
          getActiveUsersAtStart(payments, year, index);

        const churnedUsers =
          getChurnedUsers(payments, year, index);

        const churnRate =
          calculateChurnRate(activeUsersAtStart, churnedUsers);

        const arpu =
          calculateARPU(mrr, activeUsersAtStart);

        const ltv =
          calculateLTV(arpu, churnRate);

        return {
          month,
          mrr,
          arpu,
          churn: churnRate,
          ltv,
          activeUsers: activeUsersAtStart.size,
          churnedUsers: churnedUsers.size,
        };
      });
    };


      useEffect(() => {
  if (revenue.length > 0) {
    console.log("Sample payment:", revenue[0]);
  }
}, [revenue]);


   const result= calculateSaasMetricsByYear(revenue, selectedYear)
   console.log("Result:::::::::::",result);



  /*
  --------------------------------------------------
  OPTIONAL: Load financial data from backend API
  --------------------------------------------------
  useEffect(() => {
    async function loadFinancial() {
      const res = await authFetch("/api/admin/financial-reports");
      const data = await res.json();
      setSummary(data.summary);
      setQuarters(data.quarters);
      setYearly(data.yearly);
    }
    loadFinancial();
  }, []);
  */

    const downloadExcelReport = () => {
      if (!result || result.length === 0) {
        console.warn("No data to download");
        return;
      }

      // 📄 Format data for Excel
      const excelData = result.map(row => ({
        Month: row.month,
        "MRR (₹)": Math.round(row.mrr),
        "ARR (₹)": Math.round(row.mrr * 12),
        "ARPU (₹)": Math.round(row.arpu),
        "Churn Rate (%)": row.churn,
        "LTV (₹)": Math.round(row.ltv),
        "Active Users": row.activeUsers,
        "Churned Users": row.churnedUsers,
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Report");

      // Download file
      XLSX.writeFile(
        workbook,
        `Revenue_Report_${selectedYear}.xlsx`
      );
    };




return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Revenue & Analytics
        </h1>
        <p className="text-gray-500 max-w-xl">
          Track revenue metrics, customer analytics, and market insights for your
          B2B sharing platform
        </p>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-orangeButton my-custom-class">
          Monthly Recurring Revenue (MRR)
        </h2>
       <div className="flex gap-5">
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="
                bg-[#f5f5f5]
                h-12
                w-[180px]
                rounded-full
                shadow-none
                border border-[#e5e5e5]
                text-[#555]
                px-4
                cursor-pointer
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:border-[#e5e5e5]
              ">
            <SelectValue placeholder="Year" />
          </SelectTrigger>

          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="bg-black text-white rounded-full px-4 py-2 text-sm flex items-center gap-2" onClick={downloadExcelReport}>
          <Download className="w-4 h-4" />
          Download Reports
        </Button>
        </div>
      </div>

      {/* MRR Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Month", "MRR", "ARPU", "Churn", "LTV"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-black py-4 px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {result.map((row) => (
                <tr key={row.month} className="border-t">
                  <td className="py-5 px-6 font-medium text-black">
                    {row.month}
                  </td>
                  <td className="py-5 px-6 font-medium text-black">
                    ${row.mrr.toLocaleString()}
                  </td>
                  <td className="py-5 px-6 font-medium text-black">
                    ${row.arpu.toLocaleString()}
                  </td>
                  <td className="py-5 px-6">
                    <Badge className="bg-green-50 text-green-600 border border-green-200 rounded-full px-3 py-1 text-xs">
                      {row.churn}%
                    </Badge>
                  </td>
                  <td className="py-5 px-6 font-medium text-black">
                    ${row.ltv.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

