'use client'

import { FC } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

interface EditorOutputProps {
  content: any
}

function CustomCodeRenderer({ data }: any) {

  return (
    <pre className='bg-gray-800 rounded-md p-4'>
      <code className='text-gray-100 text-sm'>{data.code}</code>
    </pre>
  )
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className='relative w-full min-h-[15rem]'>
      <Image alt='image' className='object-contain' fill src={src} />
    </div>
  )
}

function CustomListRenderer({ data }: any) {

  return (
    <div className='relative mr-6 px-4 py-2 '>
      {data?.items.map((item: any, index: any) =>
        <li key={index} >
          {item}
        </li>
      )}
    </div>
  )
}

function CustomHeaderRenderer({ data }: any) {

  return (
    <h2 className='relative font-bold text-xl '>
      {data?.text}
    </h2>
  )
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  list: CustomListRenderer,
  header: CustomHeaderRenderer
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}


const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    // @ts-ignore
    <Output
      style={style}
      className='text-sm'
      renderers={renderers}
      data={content}
    />
  )
}

export default EditorOutput