"use client"
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/TextArea';
import { CommentRequest } from '@/lib/validators/Comment';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'react-hot-toast';


interface CreateCommentProps {
    postId: string,
    replyToId?: string
}


const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
    const [input, setInput] = useState<string>("")
    const router = useRouter()

    const { isLoading, mutate: sendThought } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId, text, replyToId
            }
            const { data } = await axios.patch(`/api/broadcast/post/comments`, payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return toast.error("Please, login to Create your Broadcast");
                }
            }
            toast.error("Failed to add your Thoughts");
        },
        onSuccess: () => {
            toast.success("Your Thoughts has been Added!");
            router.refresh()
            setInput("")
        },
    })

    return <div className='grid w-full gap-1.5 ' >
        <Label htmlFor='comment' > Your Comment</Label>
        <Textarea id="comment" value={input} onChange={(e) => { setInput(e.target.value) }} placeholder='Your Thoughts' />
        <Button className='w-fit ml-auto mt-1' isLoading={isLoading} disabled={input.length === 0 || isLoading} onClick={() => sendThought({ postId, text: input, replyToId })} >ADD</Button>
    </div>;
};


CreateComment.displayName = 'CreateComment'
export default CreateComment