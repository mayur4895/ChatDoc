// types.ts or wherever you keep your types
type EmailAddress = {
    created_at: number;
    email_address: string;
    id: string;
  };
  
  type EventType = "user.created" | "user.updated" | "*";
  
  export type Event = {
    data: {
      id: string;
      email_addresses: EmailAddress[];
      // Add any other properties as needed
    };
    object: "event";
    type: EventType;
  };
  


  