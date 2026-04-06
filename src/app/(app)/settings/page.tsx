"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">الإعدادات</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {session?.user?.name?.charAt(0) || "م"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full h-11 rounded-xl gap-2 text-destructive hover:text-destructive"
      >
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </Button>
    </div>
  );
}
