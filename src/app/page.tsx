"use client"
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation"
import { useEffect } from 'react';


export default function Home() {
   const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <Loading />
  );
}