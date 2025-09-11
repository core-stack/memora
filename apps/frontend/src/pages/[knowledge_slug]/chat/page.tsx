import { useEffect, useMemo, useRef } from 'react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useRouter } from '@/hooks/use-router';

import type { ImperativePanelHandle } from 'react-resizable-panels';
export default function ChatPage() {
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const mainRef = useRef<ImperativePanelHandle>(null);
  const auxRef = useRef<ImperativePanelHandle>(null);
  const router = useRouter();
  useEffect(() => {
    if (sidebarRef.current && mainRef.current && auxRef.current) {
      const sidebarSize = sidebarRef.current.getSize();
      const mainSize = mainRef.current.getSize();
      const auxSize = auxRef.current.getSize();
      console.log(sidebarSize, mainSize, auxSize);
    }
  }, [sidebarRef.current?.getSize(), mainRef.current?.getSize(), auxRef.current?.getSize()]);

  const urlStorage = useMemo(() => ({
    getItem(name: string) {
      console.log(name);
      
      try {
        const parsed = JSON.parse(decodeURI(window.location.hash.substring(1)));
        return parsed[name] || "";
      } catch (error) {
        console.error(error);
        return "";
      }
    },
    setItem(name: string, value: string) {
      console.log(name, value);
      const encoded = encodeURI(JSON.stringify({
        [name]: value
      }));
  
      router.push('#' + encoded);
    }
  }), [router]);
  
  return (
    <ResizablePanelGroup direction="horizontal" onChange={console.log} storage={urlStorage}>
      <ResizablePanel defaultSize={15} minSize={15} maxSize={30} ref={sidebarRef}>
        <ul className='bg-red-500'>
          <li>Chat 1</li>
          <li>Chat 2</li>
          <li>Chat 3</li>
          <li>Chat 4</li>
          <li>Chat 5</li>
          <li>Chat 6</li>
        </ul>
      </ResizablePanel>
      <ResizableHandle withHandle onChange={console.log} onDrag={console.log}/>
      <ResizablePanel ref={mainRef} >
        
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel ref={auxRef}>
        
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}