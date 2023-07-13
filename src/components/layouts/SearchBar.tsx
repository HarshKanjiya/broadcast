"use client"
import { FC, useCallback, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/Command';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Broadcast, Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import debounce from 'lodash.debounce';


interface SearchBarProps {

}


const SearchBar: FC<SearchBarProps> = ({ }) => {

    const [input, setInput] = useState<string>("")


    const { data: Results, refetch, isFetched, isFetching } = useQuery({
        queryFn: async () => {
            if (!input.length) return []

            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (Broadcast & {
                _count: Prisma.BroadcastCountOutputType
            })[]
        },
        queryKey: ["search-query"],
        enabled: false
    })

    const router = useRouter()

    const request = debounce(() => {
        refetch()
    })
    const debounceReq = useCallback(() => {
        request()
    }, [])

    return <div className='ml-auto mr-6' >
        <Command className='relative rounded-lg border max-w-lg overflow-visible' >
            <CommandInput value={input} onValueChange={(text) => {
                setInput(text)
                debounceReq()
            }} className='outline-none border-none focus:outline-none focus:border-none ring-0' placeholder='Search Broadcasts' ></CommandInput>

            {
                input.length > 0 ? (
                    <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md' >
                        {isFetched && <CommandEmpty>No Broadcast found.</CommandEmpty>}
                        {(Results?.length ?? 0) > 0 ? (
                            <CommandGroup heading="Broadcasts" >
                                {
                                    Results?.map((broadcast) => (
                                        <CommandItem key={broadcast.id} onSelect={(e) => {
                                            router.push(`/broadcast/${e}`)
                                            router.refresh()
                                            setInput("")
                                        }} value={broadcast.name} >
                                            <Users className='mr-2 h-4 w-4' />
                                            <a href={`/broadcast/${broadcast.name}`} >{broadcast.name}</a>
                                        </CommandItem>
                                    ))
                                }
                            </CommandGroup>
                        ) : null}
                    </CommandList>
                ) : null
            }

        </Command>
    </div>;
};


SearchBar.displayName = 'SearchBar'
export default SearchBar