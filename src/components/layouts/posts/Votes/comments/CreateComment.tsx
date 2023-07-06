"use client"
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/TextArea';
import { CommentRequest } from '@/lib/validators/Comment';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FC, useState } from 'react';


interface CreateCommentProps {

}


const CreateComment: FC<CreateCommentProps> = ({ }) => {
    const [input, setInput] = useState<string>("")

    const { } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId, text, replyToId
            }
            const { data } = await axios.patch(`/api/broadcast/post/comment`, payload)
        }
    })

    return <div className='grid w-full gap-1.5 ' >
        <Label htmlFor='comment' > Your Comment</Label>
        <Textarea id="comment" value={input} onChange={(e) => { setInput(e.target.value) }} placeholder='Your Thoughts' />
    </div>;
};


CreateComment.displayName = 'CreateComment'
export default CreateComment