"use client";

import {
  BarChart3,
  Calendar,
  Home,
  MessageSquare,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnalyticsData } from "./page";

const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(142 76% 36%)",
  warning: "hsl(38 92% 50%)",
  muted: "hsl(var(--muted-foreground))",
};

const PIE_COLORS = ["#22c55e", "#f59e0b", "#6366f1"];

type Props = {
  data: AnalyticsData;
};

export function AnalyticsDashboard({ data }: Props) {
  const [dateRange, setDateRange] = useState("30d");

  // Calculate rates
  const conversionRate =
    data.leads.total > 0
      ? ((data.leads.closed / data.leads.total) * 100).toFixed(1)
      : "0";
  const contactRate =
    data.leads.total > 0
      ? (
          ((data.leads.contacted + data.leads.closed) / data.leads.total) *
          100
        ).toFixed(1)
      : "0";

  // Prepare pie chart data for listing status
  const listingStatusData = [
    { name: "Active", value: data.listings.active, color: PIE_COLORS[0] },
    { name: "Pending", value: data.listings.pending, color: PIE_COLORS[1] },
    { name: "Sold", value: data.listings.sold, color: PIE_COLORS[2] },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your performance and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="365d">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listing KPIs */}
      <div>
        <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" aria-hidden="true" />
          Listings Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Listings"
            value={data.listings.total}
            icon={Home}
            color="primary"
          />
          <KPICard
            title="Active"
            value={data.listings.active}
            icon={TrendingUp}
            color="success"
          />
          <KPICard
            title="Pending"
            value={data.listings.pending}
            icon={BarChart3}
            color="warning"
          />
          <KPICard
            title="Sold"
            value={data.listings.sold}
            icon={Home}
            color="secondary"
          />
        </div>
      </div>

      {/* Lead KPIs */}
      <div>
        <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
          <MessageSquare
            className="h-5 w-5 text-secondary"
            aria-hidden="true"
          />
          Leads Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="New Leads"
            value={data.leads.new}
            icon={Users}
            color="primary"
          />
          <KPICard
            title="Total Leads"
            value={data.leads.total}
            icon={MessageSquare}
            color="secondary"
          />
          <KPICard
            title="Contact Rate"
            value={`${contactRate}%`}
            icon={Phone}
            color="success"
          />
          <KPICard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={TrendingUp}
            color="warning"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Property Bar Chart */}
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="font-heading">Leads by Property</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leadsByProperty.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.leadsByProperty}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="leads"
                    fill={CHART_COLORS.primary}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No lead data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Listing Status Pie Chart */}
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="font-heading">
              Listing Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listingStatusData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={listingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {listingStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {listingStatusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No listing data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type KPICardProps = {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "success" | "warning";
};

function KPICard({ title, value, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    success: "bg-green-500/10 text-green-600",
    warning: "bg-amber-500/10 text-amber-600",
  };

  return (
    <div className="bg-background rounded-2xl border border-border/50 p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <div className="text-3xl font-bold font-heading tabular-nums">
        {value}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
