import Link from 'next/link'
 
export default function NotFound() {
  return (
    <section className='h-screen grid place-item-center'>
      <div className='flex flex-col gap-2 items-center p-10 justify-center border-2 border-black w-fit m-auto'>
        <h2 className='text-2xl border-b-2 border-black'>Not Found</h2>
        <p className='text-gray-700'>Could not find requested resource</p>
        <Link href="/" className='border-2 mt-5 rounded-lg p-2 border-black'>Return Home</Link>
      </div>
    </section>
  )
}