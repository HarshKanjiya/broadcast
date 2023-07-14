"use client"

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { UserNameRequest, UserNameValidator } from '@/lib/validators/UserName';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';


interface UserNameFormProps {
    user: Pick<User, "id" | "username">
}


const UserNameForm: FC<UserNameFormProps> = ({ user }) => {


    const router = useRouter()

    const { handleSubmit, register, formState: { errors } } = useForm<UserNameRequest>({
        resolver: zodResolver(UserNameValidator),
        defaultValues: {
            name: user?.username || ""
        }
    })

    const { mutate: updateUsername, isLoading } = useMutation({
        mutationFn: async ({ name }: UserNameRequest) => {
            const payload: UserNameRequest = { name }

            const { data } = await axios.patch(`api/username`, payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast.error("username Already Taken, please try Different username. ");
                }
                if (err.response?.status === 422) {
                    return toast.error("username must be between 3 to 28 characters");
                }
                if (err.response?.status === 401) {
                    return toast.error("Please, login to Create your Broadcast");
                }
            }
            toast.error("Failed to Create Broadcast Network");
        },
        onSuccess: () => {
            toast.success("Your Username has been Updated !");
            router.refresh()
        },
    })

    return <form onSubmit={handleSubmit((E) => { updateUsername(E) })} >
        <Card>
            <CardHeader>
                <CardTitle>your username</CardTitle>
                <CardDescription>Please, enter display name you like.   </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative grid gap-1 ">
                    <div className='absolute top-0 left-5 w-8 h-10 grid place-items-center ' >
                        <span className='text-sm text-zinc-400' >user/</span>
                    </div>

                    <Label className='sr-only' htmlFor='name' >Name</Label>

                    <Input id='name' className='w-[400px] pl-16' size={32} {...register("name")} />

                    {
                        errors?.name && (
                            <p className='px-1 text-xs text-red-600' >
                                {errors.name.message}
                            </p>
                        )
                    }

                </div>
            </CardContent>
            <CardFooter>
                <Button isLoading={isLoading} >change name</Button>
            </CardFooter>
        </Card>
    </form>;
};


UserNameForm.displayName = 'UserNameForm'
export default UserNameForm