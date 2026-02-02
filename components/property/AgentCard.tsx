"use client";

import { Building, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "@/lib/sanity/image";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  children?: ReactNode;
}

export function AgentCard({ agent, children }: AgentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            {agent.photo?.asset ? (
              <AvatarImage
                src={urlFor(agent.photo).width(128).height(128).url()}
                alt={agent.name}
              />
            ) : null}
            <AvatarFallback className="text-lg">
              {getInitials(agent.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            {agent.agency && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{agent.agency}</span>
              </div>
            )}
          </div>
        </div>

        {agent.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {agent.bio}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {agent.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${agent.email}`}
                className="text-primary hover:underline"
              >
                {agent.email}
              </a>
            </div>
          )}
          {agent.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${agent.phone}`}
                className="text-primary hover:underline"
              >
                {agent.phone}
              </a>
            </div>
          )}
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
