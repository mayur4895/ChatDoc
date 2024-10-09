"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PiArrowURightUpBold } from "react-icons/pi";

const FormSchema = z.object({
  userInput: z
    .string()
    .min(1, {
      message: "userInput must be at least 1 characters.",
    }),
});



interface ChatInputProps {
  userInputMessage: string;
  onInputChange: (value: string) => void;
  onSubmitInput: () => Promise<void>;
  isLoading: boolean;
}
const ChatInput = ({onSubmitInput,onInputChange}:ChatInputProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Function to adjust textarea height dynamically
  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onSubmitInput();
  form.reset();
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex items-end gap-2 w-full"
        >
   <FormField
  control={form.control}
  name="userInput"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormControl>
      <Textarea
                    placeholder="ask me.."
                    className="resize-none overflow-y-auto max-h-48 pt-[.70rem] min-h-2 h-2 outline-none"
                    {...field}
                    onChange={(e) => {
                      handleResize(e); // Resize on change
                      field.onChange(e); // Call the original onChange from react-hook-form
                      onInputChange(e.target.value); // Update message in the store
                    }}
                    style={{ height: "auto" }}
                  />
      </FormControl>
    </FormItem>
  )}
/>

          <Button type="submit" className="rounded-full" size={"icon"} disabled={!form.getValues('userInput')}>
            <PiArrowURightUpBold />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
