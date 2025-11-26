"use server";

import { z } from 'zod';
import { rsvpList } from '@/lib/data';

const RsvpSchema = z.object({
  name: z.string().min(2, { message: "Por favor, insira seu nome." }),
  surname: z.string().min(2, { message: "Por favor, insira seu sobrenome." }),
  phone: z.string().min(9, { message: "Por favor, insira um telefone válido." }),
  hasTransport: z.enum(['yes', 'no'], { required_error: "Por favor, selecione uma opção." }),
});

export type State = {
  errors?: {
    name?: string[];
    surname?: string[];
    phone?: string[];
    hasTransport?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function submitRsvp(prevState: State, formData: FormData) {
  const validatedFields = RsvpSchema.safeParse({
    name: formData.get('name'),
    surname: formData.get('surname'),
    phone: formData.get('phone'),
    hasTransport: formData.get('hasTransport'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Falha ao confirmar presença. Verifique os campos.',
      success: false,
    };
  }
  
  const { name, surname, phone, hasTransport } = validatedFields.data;

  // In a real app, this would save to a database.
  // For this demo, we push to an in-memory array on the server.
  // Note: This data will be lost on server restart.
  try {
    rsvpList.push({
      id: new Date().toISOString(),
      name,
      surname,
      phone,
      hasTransport,
      confirmedAt: new Date(),
    });
    console.log('New RSVP:', rsvpList[rsvpList.length - 1]);
    return { success: true, message: 'Presença confirmada com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Ocorreu um erro no servidor.' };
  }
}
