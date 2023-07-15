"use client"
import { Bell } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/DropdownMenu";
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import moment from 'moment';
import { redirect, useRouter } from 'next/navigation';

interface NotificationProps {
    notifications: any
}


const NotificationEle: FC<NotificationProps> = ({ notifications }) => {

    const [newNotif, setNewNotif] = useState<boolean>(false)
    const { mutate } = useMutation({
        mutationFn: async ({ postId, type }: { postId: string, type: "SEEN" | "UNSEEN" }) => {

            if (type === "UNSEEN") {
                const { data } = await axios.put(`/api/notification`, { postId, type: "SEEN" })
                return data
            }
            else {
                return { postId }
            }
        },
        onSuccess: (data) => {
            console.log('data :>> ', data);
            redirect(`/broadcast/post/${data.postId}`)
        }
    })

    useEffect(() => {
        notifications.map((notif: any) => {
            if (notif?.type === "UNSEEN") {
                setNewNotif(true)
            }
        })
    }, [notifications])

    return <div className="flex items-center gap-5 sm:gap-8 ">
        <DropdownMenu>
            <DropdownMenuTrigger className='relative p-1 ring-0 focus:ring-0 outline-none focus:bg-gray-100 rounded-sm ' >
                <Bell className='w-6 h-6' />
                {
                    newNotif && <div className='absolute w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-white top-0 right-0' />
                }

            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
                <div className="flex flex-col space-y-1 p-2 ">

                    {
                        notifications.map((notif: any, index: number) => {
                            return (
                                <DropdownMenuItem className={notif.type === "UNSEEN" ? "opacity-100" : "opacity-50"} key={index} asChild>
                                    <Button variant="ghost" onClick={() => { mutate({ postId: notif.post.id, type: notif.type }) }} className='flex h-fit items-start gap-4 ring-0 hover:ring-0 focus:ring-0 ' >
                                        <div className='relative h-10 w-10 flex items-center rounded-full overflow-hidden' >
                                            <Image fill src={notif.post.author.image} alt="sf" />
                                        </div>
                                        <div>
                                            <div className='w-full flex justify-between' >
                                                <h2 className='text-base font-bold ' > {notif.post.title} </h2>
                                                <p className='text-gray-400' >{moment(notif.createdAt).toNow()}</p>
                                            </div>
                                            <p>by {notif.post.author.username} on {notif.post.broadcast.name} Broadcast!</p>
                                        </div>

                                    </Button>
                                </DropdownMenuItem>
                            )
                        })
                    }

                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>;
};


NotificationEle.displayName = 'NotificationEle'
export default NotificationEle