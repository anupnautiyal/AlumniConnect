'use client';

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, MoreVertical, Circle, Loader2, User } from "lucide-react"
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc, limit } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from "@/lib/utils";

function ChatContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const initialRecipientId = searchParams.get('recipientId');
  
  const [activeRecipientId, setActiveRecipientId] = useState<string | null>(initialRecipientId);
  const [messageText, setMessageText] = useState("");

  // Get recipient profile if there's an active recipient
  const recipientDocRef = useMemoFirebase(() => {
    if (!firestore || !activeRecipientId) return null;
    return doc(firestore, 'users', activeRecipientId);
  }, [firestore, activeRecipientId]);
  const { data: recipientData } = useDoc(recipientDocRef);

  // Derive conversation ID: lexicographical order of UIDs to ensure P2P uniqueness
  const conversationId = activeRecipientId && user 
    ? [user.uid, activeRecipientId].sort().join('_') 
    : null;

  // Messages in current conversation
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !conversationId) return null;
    return query(
      collection(firestore, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
  }, [firestore, conversationId]);
  const { data: messages, isLoading: isMessagesLoading } = useCollection(messagesQuery);

  // Recent conversations (Sidebar)
  // Note: For a real app, we'd query a 'conversations' collection indexed by participant.
  // For MVP, we'll fetch all users (alumni/mentors) as potential chat partners.
  const alumniQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('role', 'in', ['mentor', 'alumni']), limit(20));
  }, [firestore]);
  const { data: alumniList, isLoading: isAlumniLoading } = useCollection(alumniQuery);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user || !activeRecipientId || !conversationId || !firestore) return;

    const newMessage = {
      id: crypto.randomUUID(),
      senderId: user.uid,
      receiverId: activeRecipientId,
      message: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    addDocumentNonBlocking(
      collection(firestore, 'conversations', conversationId, 'messages'), 
      newMessage
    );

    setMessageText("");
  };

  const recipientName = recipientData 
    ? `${recipientData.firstName} ${recipientData.lastName}` 
    : "Select a Contact";

  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-80px)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border bg-card rounded-xl shadow-lg h-full overflow-hidden">
        {/* Sidebar */}
        <div className="md:col-span-1 border-r flex flex-col h-full bg-muted/10">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 bg-card" placeholder="Search chats..." />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {isAlumniLoading ? (
              <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin opacity-20" /></div>
            ) : (
              alumniList?.filter(a => a.id !== user?.uid).map((person) => (
                <div 
                  key={person.id} 
                  onClick={() => setActiveRecipientId(person.id)}
                  className={cn(
                    "p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors relative",
                    activeRecipientId === person.id && "bg-primary/5 border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {person.firstName[0]}{person.lastName[0]}
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-sm truncate">{person.firstName} {person.lastName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex md:col-span-2 flex-col h-full bg-card">
          {!activeRecipientId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <MessageSquare className="h-10 w-10 opacity-20" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Chat Selected</h3>
              <p>Choose a mentor from the sidebar or directory to start a conversation.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {recipientData ? `${recipientData.firstName[0]}${recipientData.lastName[0]}` : '??'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{recipientName}</h3>
                    <div className="flex items-center gap-1.5">
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                      <span className="text-[10px] text-muted-foreground">Active now</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-6">
                {isMessagesLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin opacity-20" /></div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages && messages.length > 0 ? (
                      messages.map((msg) => {
                        const isMe = msg.senderId === user?.uid;
                        return (
                          <div key={msg.id} className={cn("flex", isMe ? 'justify-end' : 'justify-start')}>
                            <div className={cn(
                              "max-w-[70%] p-3 rounded-2xl text-sm",
                              isMe 
                                ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm' 
                                : 'bg-muted text-foreground rounded-tl-none'
                            )}>
                              {msg.message}
                              <div className={cn(
                                "text-[10px] mt-1 text-right",
                                isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 text-muted-foreground italic text-sm">
                        No messages yet. Say hello to {recipientData?.firstName}!
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t bg-card/50">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..." 
                    className="bg-muted/30 h-11" 
                  />
                  <Button type="submit" size="icon" className="bg-primary rounded-full shrink-0 h-11 w-11 shadow-md">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading chats...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
