'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitRsvp, State } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const RsvpSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  surname: z.string().min(2, "Sobrenome muito curto"),
  phone: z.string().min(9, "Telefone inválido"),
  hasTransport: z.enum(['yes', 'no']),
});
type RsvpFormValues = z.infer<typeof RsvpSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Enviar Confirmação
    </Button>
  );
}

export function RsvpModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const initialState: State = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(submitRsvp, initialState);

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(RsvpSchema),
    defaultValues: { name: '', surname: '', phone: '', hasTransport: undefined },
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Presença Confirmada!",
        description: "Agradecemos por fazer parte deste momento especial.",
      });
      onOpenChange(false);
      form.reset();
    } else if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Erro na Confirmação",
        description: state.message,
      });
    }
  }, [state, toast, onOpenChange, form]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary text-2xl">Confirmar Presença</DialogTitle>
          <DialogDescription>
            Por favor, preencha seus dados para confirmar sua presença no nosso casamento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={dispatch} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage>{state.errors?.name?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu sobrenome" {...field} />
                  </FormControl>
                  <FormMessage>{state.errors?.surname?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage>{state.errors?.phone?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasTransport"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Possui transporte próprio?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" id="transport-yes" />
                        </FormControl>
                        <FormLabel htmlFor="transport-yes" className="font-normal">Sim</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" id="transport-no" />
                        </FormControl>
                        <FormLabel htmlFor="transport-no" className="font-normal">Não</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage>{state.errors?.hasTransport?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter className='pt-4'>
              <SubmitButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
