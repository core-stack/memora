import { Brain } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Form } from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export const TopBar = () => {

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-16 w-full justify-between items-center gap-2 px-4">
        <div className='flex items-center gap-2'>
          <Brain />
          <Select>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select the knowledge base" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="category1">Category 1</SelectItem>
              <SelectItem value="category2">Category 2</SelectItem>
              <SelectItem value="category3">Category 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TopBarSearch />
      </div>
    </header>
  )
}


const TopBarSearch = () => {
  const form = useForm();
  return (
    <Form {...form}>
      <FormInput className='w-full' fieldClassName='w-full max-w-[50%]' name='search' placeholder='Search' />
    </Form>
  )
}