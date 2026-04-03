import { getAllEvents } from "@/db/queries";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin-delete-button";
import { deleteEventAction } from "@/lib/actions/events";


export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">活动管理</h1>
        <Link href="/admin/events/new" className={buttonVariants()}>添加活动</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>日期</TableHead>
            <TableHead>地点</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title_zh}</TableCell>
              <TableCell>{event.date_start}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Badge variant={event.is_published ? "default" : "outline"}>
                  {event.is_published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/events/${event.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>编辑</Link>
                  <DeleteButton id={event.id} action={deleteEventAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
