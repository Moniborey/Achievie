'use client'

import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'

export interface filterSort{
  value:sort,
  direction:'ascending'|'descending'
}
export type sort = 'name'|'duedate'|'dateadded'|'priority'|''
export type group = 'duedate' | 'dateadded' | 'priority' | 'tag'|''

interface filterObject{
  isViewCompleted:boolean
  priority:string[]
  sort:filterSort
  group:group
  count:number
}

interface filterContext{
  filter:filterObject
  setFilter:Dispatch<SetStateAction<filterObject>>
}

export const initialFilter : filterObject = {
  isViewCompleted:true,
  priority:['P1','P2','P3','P4'],
  sort:{
    value:'',
    direction:'ascending'
  },
  group:'',
  count:0
}

const filterContext = createContext<filterContext | null>(null)

export const useFilterContext = () => {
  const context = useContext(filterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};

// export const useFilterContext = () => useContext(filterContext)!;

export default function FilterContextProvider({children}:{children:React.ReactNode}) {

  const localStoredFilters = typeof localStorage !== 'undefined' && localStorage.getItem('filters')
  const [filter,setFilter] = useState(localStoredFilters ? JSON.parse(localStoredFilters) : initialFilter)

  useEffect(()=>{
    let count = 0
    if(filter.group !== initialFilter.group) count++
    if(filter.isViewCompleted !== initialFilter.isViewCompleted) count++
    if(filter.priority.length !== initialFilter.priority.length) count++
    if(filter.sort.value !== initialFilter.sort.value) count++
    if(count !== filter.count){
      setFilter((prev:any)=>({...prev,count:count}))
    }
  },[filter.isViewCompleted, filter.priority, filter.sort.value,filter.count,filter.group])

  useEffect(()=>{
    localStorage.setItem('filters',JSON.stringify(filter))
  },[filter])

  return (
    <filterContext.Provider value={{filter,setFilter}}>
      {children}
    </filterContext.Provider>
  )
}
