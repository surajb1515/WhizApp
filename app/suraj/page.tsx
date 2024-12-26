'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";






export default function SurajPage({ }) {

  useEffect(() => {
    console.log('re-rendering....')
  })

  const variableRef = useRef(0);
  console.log("🌞🌞 + file: page.tsx:17 + SurajPage + variableRef:", variableRef)



  function handleIncrease() {
    variableRef.current++;
    console.log("🌞🌞 + file: page.tsx:17 + SurajPage + variableRef:", variableRef)
  }



  return (
    <div className='p-2 tracking-tighter font-bold'>
      SurajPage
      <Button onChange={handleIncrease}>increase</Button>
    </div>
  );
}
