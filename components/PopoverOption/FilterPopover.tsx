'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { group, sort, useFilterContext } from '@/context/FilterContextProvider'
import { priorities } from './PriorityPopover'
import { ArrowDown, ArrowUp, Group } from 'lucide-react'

export default function FilterPopover() {

  const { filter, setFilter } = useFilterContext()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} className='flex gap-1'>
          <Image
            src={'/icons8-filter-32.png'}
            alt='filter'
            width={20}
            height={20}
            className='bg-cover'
          />
          <h1 className='text-red-500'>{filter?.count > 0 && `: ${filter?.count}`}</h1>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className="min-w-full mt-1 p-2 space-y-2">
        <header className='font-bold tracking-tight'>
          Sort by
        </header>
        <section className="flex flex-col border-b pb-1">
          <FilterGroup/>
          <FilterSortPopover/>
        </section>
        <header className='font-bold tracking-tight'>
          Filter
        </header>
        <section className="flex flex-col">
          <label className='h-9 cursor-pointer px-0 hover:bg-accent hover:text-accent-foreground flex justify-between text-gray-700 items-center'>
            <div className='flex gap-2 items-center'>
              <Image
                src={'/icons8-check-24.png'}
                alt='hideChecked'
                width={22}
                height={22}
                className='bg-cover opacity-70'
              />
              <h1>Completed tasks</h1>
            </div>
            <Switch checked={filter.isViewCompleted} onCheckedChange={() => setFilter({ ...filter, isViewCompleted: !filter.isViewCompleted})} />
          </label>
          <FilterPriorityPopover />
        </section>
      </PopoverContent>
    </Popover>
  )
}

const FilterPriorityPopover = () => {

  const { filter, setFilter } = useFilterContext()
  const handleSelect = (value: string) => {
    const newPriority = [...filter.priority, value]
    setFilter(prev => ({ ...prev, priority: prev.priority.includes(value) ? prev.priority.filter(p => p !== value) : newPriority }))
  }
  const filterName = filter.priority.length === 4 ? 'All (default)' : filter.priority.map(p=>`${p}`).join('|')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} className='flex h-9 justify-between text-gray-700 px-0 items-center'>
          <div className='flex gap-2 items-center'>
            <Image
              src={'/priorities/P4.png'}
              alt='priority'
              width={22}
              height={22}
              className='bg-cover bg-opacity-70'
            />
            <h1>Priority</h1>
          </div>
          <h1 className='text-gray-500 flex items-center gap-1'>
            {filterName}
            <Image 
            src={'/icons8-expand-arrow-20.png'}
            alt='arrowdown'
            width={13}
            height={13}
            className='bg-cover opacity-70'
            />
          </h1>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className="w-[150px] p-0">
        <div className='p-1'>
          {priorities.map((p, index: number) => (
            <button
              key={index}
              onClick={() => handleSelect(p.value)}
              className='flex w-full justify-between gap-3 hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-2 border-0 items-center'>
              <div className='flex gap-3 items-center'>
                <Image
                  src={`/priorities/${p.value}.png`}
                  alt=''
                  width={20}
                  height={20}
                  className='bg-cover'
                />
                <p className="text-sm">
                  {p.label}
                </p>
              </div>
              {
                filter.priority.includes(p.value) &&
                <Image
                  src={`/priorities/Pcheck.png`}
                  alt=''
                  width={18}
                  height={18}
                  className='bg-cover'
                />
              }
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface Sort {
  label: 'Name' | 'Priority' | 'Date added' | 'Due date' | 'Auto (default)'
  value: sort
}

const FilterGroup = () => {

  const {filter,setFilter} = useFilterContext()

  const groupOptions = [{
    label:'None (default)',
    value:'' as group
  },{
    label:'Priority',
    value:'priority' as group
  },{
    label:'Tag',
    value:'tag' as group
  },{
    label:'Due date',
    value:'duedate' as group
  },{
    label:'Date added',
    value:'dateadded' as group
  }
]

const handleSelectValue = (g:group) => {
  setFilter(prev=>({...prev,group:g}))
}

const groupName = filter.group ? groupOptions.filter(g=>g.value===filter.group)[0].label : 'None (default)'

  return(
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} className='flex h-9 justify-between text-gray-700 px-0 items-center'>
          <div className='flex gap-2 items-center'>
            <Group color='gray' width={22} height={22}/>
            <h1>Grouping</h1>
          </div>
          <h1 className='text-gray-500 flex items-center gap-1'>
            {groupName}
            <Image 
            src={'/icons8-expand-arrow-20.png'}
            alt='arrowdown'
            width={13}
            height={13}
            className='bg-cover opacity-70'
            />
          </h1>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className="w-[150px] p-0">
        <div className='p-1'>
        {groupOptions.map((g, index: number) => (
            <button
              key={index}
              onClick={() => handleSelectValue(g.value)}
              className='flex w-full justify-between gap-3 hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-1 border-0 items-center'>
                <p className="text-sm">
                  {g.label}
                </p>
              {
                filter.group === g.value &&
                <Image
                  src={`/priorities/Pcheck.png`}
                  alt=''
                  width={18}
                  height={18}
                  className='bg-cover'
                />
              }
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const FilterSortPopover = () => {
  const sortOptions: Sort[] = [
    {
      label:'Auto (default)',
      value:''
    },
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Due date',
      value: 'duedate',
    },
    {
      label: 'Date added',
      value: 'dateadded',
    },
    {
      label: 'Priority',
      value: 'priority',
    },
  ]
  const { filter, setFilter } = useFilterContext()
  const handleSelectValue = (value: sort) => {
    setFilter(prev=>({...prev,sort:{...prev.sort,value:value}}))
  }
  const handleSelectDirection = (dir:'ascending'|'descending') => {
    setFilter(prev=>({...prev,sort:{...prev.sort,direction:dir}}))
  }
  const sortName = filter.sort ? sortOptions.filter(s=>s.value===filter.sort.value)[0].label : 'Auto (default)'

  return(
    <>
    <Popover>
      <PopoverTrigger asChild>
      <Button variant={'ghost'} className='flex h-9 w-full justify-between text-gray-700 px-0 items-center'>
          <div className='flex gap-2 items-center'>
            <Image
              src={'/swap.png'}
              alt='priority'
              width={24}
              height={24}
              className='bg-cover opacity-80'
            />
            <h1>Sorting</h1>
          </div>
          <h1 className='text-gray-500 flex items-center gap-1'>
            {sortName}
            <Image 
            src={'/icons8-expand-arrow-20.png'}
            alt='arrowdown'
            width={13}
            height={13}
            className='bg-cover opacity-70'
            />
          </h1>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className="w-[150px] p-0">
        <div className='p-1'>
          {sortOptions.map((s, index: number) => (
            <button
              key={index}
              onClick={() => handleSelectValue(s.value)}
              className='flex w-full justify-between gap-3 hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-1 border-0 items-center'>
                <p className="text-sm">
                  {s.label}
                </p>
              {
                filter.sort.value === s.value &&
                <Image
                  src={`/priorities/Pcheck.png`}
                  alt=''
                  width={18}
                  height={18}
                  className='bg-cover'
                />
              }
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
    {filter.sort.value !=='' && <Popover>
      <PopoverTrigger asChild>
      <Button variant={'ghost'} className='flex h-9 w-full justify-between text-gray-700 px-0 items-center'>
          <div className='flex gap-2 items-center'>
            {filter.sort.direction==='descending'?<ArrowUp color='gray' width={24} height={24}/>:<ArrowDown color='gray' width={24} height={24}/>}
            <h1>Direction</h1>
          </div>
          <h1 className='text-gray-500 flex items-center gap-1'>
            {filter.sort.direction === 'ascending' ? 'Asc (default)' : 'Descending'}
            <Image 
            src={'/icons8-expand-arrow-20.png'}
            alt='arrowdown'
            width={13}
            height={13}
            className='bg-cover opacity-70'
            />
          </h1>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className="w-[200px] p-0">
        <div className='p-1'>
            <button
              onClick={() => handleSelectDirection('ascending')}
              className='flex w-full justify-between gap-3 hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-1 border-0 items-center'>
                <p className="text-sm">
                  Ascending (default)
                </p>
              {
                filter.sort.direction === 'ascending' &&
                <Image
                  src={`/priorities/Pcheck.png`}
                  alt=''
                  width={18}
                  height={18}
                  className='bg-cover'
                />
              }
            </button>
            <button
              onClick={() => handleSelectDirection('descending')}
              className='flex w-full justify-between gap-3 hover:bg-gray-200 hover:bg-opacity-50 rounded-md p-1 border-0 items-center'>
                <p className="text-sm">
                  Descending
                </p>
              {
                filter.sort.direction === 'descending' &&
                <Image
                  src={`/priorities/Pcheck.png`}
                  alt=''
                  width={18}
                  height={18}
                  className='bg-cover'
                />
              }
            </button>
        </div>
      </PopoverContent>
    </Popover>}
    </>
  )
}
