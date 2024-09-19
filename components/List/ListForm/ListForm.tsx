'use client'

import { Button } from '@/components/ui/button';
import { ColorVariants, Colors } from '@/lib/color';
import { list } from '@/lib/type';
import { cn } from '@/utils/CN';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface ListFormProps {
    SetIsOpenNewList: (param: boolean) => void
    Data?:list
}

interface FormData{
    userID:string,
    name:string,
    color:string,
}

const ForTailwindTORead = {
    red:'bg-red-500',
    green:'bg-green-400',
    yellow:'bg-yellow-400',
    pink:'bg-pink-400',
    purple:'bg-purple-400',
    black:'bg-black',
    blue:'bg-blue-500',
    orange:'bg-orange-400',
    cyan:'bg-cyan-500'
}

export default function AddListForm(props: ListFormProps) {
    const params = useParams()
    const [isLoading,setIsLoading] = useState(false)
    const [formData,setFormData] = useState<FormData>(props.Data || {
        userID:params.id as string,
        name:'' ,
        color:'red',
    })
    const toastMessage = props.Data ? 'Tag Edited' : 'Tag Created' 
    const saveChange = props.Data ? 'Save' : 'Add tag'

    const handleSelectColor = (por:string) => {
        setFormData(prev=>({
            ...prev,
            color: por
        }))
    }

    const handleSubmit = async(e:any) => {
        e.preventDefault();

        if(formData.color === '' || formData.name === ''){
            toast.error('Fields Required')
            return
        }

        try {
            setIsLoading(true)
            let res
            if(props.Data){
                res = await fetch(`/api/dashboard/${params.id}/list/${props.Data._id}`,{
                    headers: {
                        "Content-Type": "application/json"
                      },
                      method:'PATCH',
                      body:JSON.stringify(formData)
                })
            }
            else{
                res = await fetch(`/api/dashboard/${params.id}/list`,{
                    headers: {
                        "Content-Type": "application/json"
                      },
                      method:'POST',
                      body:JSON.stringify(formData)
                })
            }
            if(res.ok){
                toast.success(toastMessage)
            }else{
                const error = await res.json()
                toast.error(error)
            }
            props.SetIsOpenNewList(false)
            window.location.reload()

        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form 
        onSubmit={handleSubmit}
        className={cn('border w-full flex flex-col gap-2 rounded-lg bg-white p-4',
        {'p-5 gap-5':props.Data})}>
            <div className='flex gap-2 border rounded-lg p-2'>
                <div 
                className={`w-7 rounded-md 
                ${ColorVariants[formData.color as keyof typeof ColorVariants]}`}/>
                    <input 
                    type="text" 
                    placeholder='Tag Name' 
                    value={formData.name}
                    onChange={(e)=>setFormData(prev=>({
                        ...prev,
                        name:e.target.value
                    }))}
                    className='w-full font-bold text-gray-700 outline-none' 
                    />
            </div>
            <div className='text-sm border rounded-lg p-2'>
                <h1 className='font-bold text-gray-700'>Preset Colors : </h1>
                <div className='lg:flex mt-1 gap-2 flex-wrap items-center hidden'>
                    {Colors.map((color,index:number)=>(
                        <button 
                        key={index}
                        type='button'
                        onClick={()=>handleSelectColor(color)} 
                        className={`p-2 rounded-md ${ColorVariants[color as keyof typeof ColorVariants]}`}/>
                    ))}
                </div>
                <div className='lg:hidden mt-1 grid grid-cols-3 gap-1'>
                    {Colors.map((color,index:number)=>(
                        <button 
                        key={index}
                        type='button'
                        onClick={()=>handleSelectColor(color)} 
                        className={`py-2 px-4 rounded-md flex font-semibold text-white ${ColorVariants[color as keyof typeof ColorVariants]}`}>
                            {color.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            <div className='flex gap-2 text-sm justify-end text-white'> 
                <Button
                disabled={isLoading}
                type='button'
                variant={'ghost'}
                onClick={() => props.SetIsOpenNewList(false)}
                className='w-1/3 border bg-gray-100 text-gray-800 bg-opacity-70'
                >
                    Cancel
                </Button>
                <Button
                disabled={isLoading}
                type='submit'
                variant={'destructive'}
                className='flex-1 p-0'
                >
                    {saveChange}
                </Button>
            </div>
        </form>
    )
}
