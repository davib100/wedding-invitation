import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar as CalendarIcon, LogOut, Settings, ListChecks, Info, MapPin } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { WeddingSettings, RSVP } from '../../types';
import { saveSettings, getSettings } from '../services/storageService';
import { collection, onSnapshot, getFirestore } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '../lib/utils';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';
import { auth, db } from '../firebase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdate: () => void;
}

type AdminView = 'general' | 'event' | 'rsvps';

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSettingsUpdate }) => {
  const [settings, setSettings] = useState<Partial<WeddingSettings>>({});
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [view, setView] = useState<AdminView>('general');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  // Logout after 1 hour of inactivity
  useIdleTimeout(handleLogout, 3600000); 

  useEffect(() => {
    if (!isOpen) return;

    const fetchInitialSettings = async () => {
        setIsLoading(true);
        const currentSettings = await getSettings();
        setSettings(currentSettings);
        setIsLoading(false);
    };
    
    fetchInitialSettings();

    const rsvpCollection = collection(db, 'rsvps');
    const unsubscribe = onSnapshot(rsvpCollection, (snapshot) => {
        const rsvpsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RSVP));
        setRsvps(rsvpsData);
    });

    return () => unsubscribe();

  }, [isOpen]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
        // Preserve time, only change date part
        const currentDate = settings.eventDate ? new Date(settings.eventDate) : new Date();
        const newDate = new Date(date);
        newDate.setHours(currentDate.getHours());
        newDate.setMinutes(currentDate.getMinutes());
        newDate.setSeconds(currentDate.getSeconds());
        setSettings(prev => ({ ...prev, eventDate: newDate.toISOString()}));
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value; // e.g., "16:00"
    if (settings.eventDate) {
        const date = new Date(settings.eventDate);
        const [hours, minutes] = timeValue.split(':').map(Number);
        date.setHours(hours);
        date.setMinutes(minutes);
        setSettings(prev => ({ ...prev, eventDate: date.toISOString() }));
    }
  };


  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settings as WeddingSettings);
    onSettingsUpdate();
    alert('Configurações salvas com sucesso!');
  };

  if (!isOpen) return null;

  const totalGuests = rsvps.reduce((acc, rsvp) => {
    let count = 1; // The main person
    if (rsvp.hasSpouse) count += 1;
    if (rsvp.hasChildren) count += rsvp.childrenCount;
    return acc + count;
  }, 0);


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-2 sm:p-4 animate-fade-in">
        <div className="container mx-auto bg-paper rounded-lg shadow-2xl h-full flex flex-col sm:flex-row overflow-hidden">
            
            {/* Sidebar */}
            <aside className="w-full sm:w-64 bg-paper-dark p-4 flex flex-col justify-between border-b sm:border-r border-gold/10">
                <div>
                    <h1 className="text-2xl font-bold text-gold-dark font-serif mb-8 text-center sm:text-left">Admin</h1>
                    <nav className="flex flex-row sm:flex-col gap-2">
                        <Button variant={view === 'general' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setView('general')}><Info className="mr-2"/> Informações Gerais</Button>
                        <Button variant={view === 'event' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setView('event')}><MapPin className="mr-2"/> Detalhes do Evento</Button>
                        <Button variant={view === 'rsvps' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setView('rsvps')}><ListChecks className="mr-2"/> Convidados</Button>
                    </nav>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                    <Button onClick={onClose} variant="outline">Fechar Painel</Button>
                    <Button onClick={handleLogout} variant="destructive"><LogOut className="mr-2"/> Logout</Button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
              {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                      <p className="text-ink font-serif">Carregando...</p>
                  </div>
              ) : (
                <form onSubmit={handleSettingsSubmit} className="h-full flex flex-col">
                  <div className="flex-grow">
                      {view === 'general' && (
                          <div className="animate-fade-in space-y-6">
                              <h2 className="text-3xl font-semibold font-serif text-ink border-b border-gold/20 pb-2">Informações Gerais</h2>
                              <div>
                                <Label htmlFor="groomName">Nome do Noivo</Label>
                                <Input id="groomName" name="groomName" value={settings.groomName || ''} onChange={handleSettingsChange} />
                              </div>
                              <div>
                                <Label htmlFor="brideName">Nome da Noiva</Label>
                                <Input id="brideName" name="brideName" value={settings.brideName || ''} onChange={handleSettingsChange} />
                              </div>
                              <div>
                                <Label htmlFor="introText">Texto de Introdução</Label>
                                <Textarea id="introText" name="introText" value={settings.introText || ''} onChange={handleSettingsChange} />
                              </div>
                              <div>
                                <Label htmlFor="inviteText">Texto do Convite</Label>
                                <Textarea id="inviteText" name="inviteText" value={settings.inviteText || ''} onChange={handleSettingsChange} />
                              </div>
                               <div>
                                <Label htmlFor="thankYouText">Texto de Agradecimento</Label>
                                <Textarea id="thankYouText" name="thankYouText" value={settings.thankYouText || ''} onChange={handleSettingsChange} />
                              </div>
                          </div>
                      )}
                      {view === 'event' && (
                          <div className="animate-fade-in space-y-6">
                              <h2 className="text-3xl font-semibold font-serif text-ink border-b border-gold/20 pb-2">Detalhes do Evento</h2>
                              <div className='flex items-center gap-4'>
                                <div className='flex-1'>
                                    <Label>Data do Evento</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !settings.eventDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {settings.eventDate ? new Date(settings.eventDate).toLocaleDateString('pt-BR') : <span>Escolha uma data</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={settings.eventDate ? new Date(settings.eventDate) : undefined}
                                            onSelect={handleDateChange}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className='w-40'>
                                    <Label>Horário</Label>
                                    <Input 
                                        type="time"
                                        value={settings.eventDate ? new Date(settings.eventDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'}) : ''}
                                        onChange={handleTimeChange}
                                    />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="eventLocation">Local do Evento</Label>
                                <Input id="eventLocation" name="eventLocation" value={settings.eventLocation || ''} onChange={handleSettingsChange} />
                              </div>
                              <div>
                                <Label htmlFor="eventAddress">Endereço do Evento</Label>
                                <Input id="eventAddress" name="eventAddress" value={settings.eventAddress || ''} onChange={handleSettingsChange} />
                              </div>
                              <div>
                                <Label htmlFor="mapUrl">URL do Embed do Google Maps</Label>
                                <Input id="mapUrl" name="mapUrl" value={settings.mapUrl || ''} onChange={handleSettingsChange} />
                              </div>
                          </div>
                      )}
                      {view === 'rsvps' && (
                          <div className="animate-fade-in">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-3xl font-semibold font-serif text-ink">Lista de Convidados</h2>
                                <div className='text-right'>
                                  <p className='font-bold text-lg text-gold-dark'>{rsvps.length} confirmações</p>
                                  <p className='text-sm text-ink/70'>{totalGuests} pessoas no total</p>
                                </div>
                              </div>
                              <div className="overflow-auto bg-paper-dark p-2 rounded-md h-[calc(100vh-250px)]">
                                  <table className="min-w-full bg-white border border-gold/20">
                                  <thead className="bg-paper-dark sticky top-0">
                                      <tr>
                                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Nome</th>
                                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Acompanhante</th>
                                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Filhos</th>
                                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Telefone</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {rsvps.map(rsvp => (
                                      <tr key={rsvp.id}>
                                          <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.firstName} {rsvp.lastName}</td>
                                          <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.hasSpouse ? rsvp.spouseName : 'Não'}</td>
                                          <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.hasChildren ? rsvp.childrenCount : 'Não'}</td>
                                          <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.phone}</td>
                                      </tr>
                                      ))}
                                      {rsvps.length === 0 && (
                                          <tr>
                                              <td colSpan={4} className="text-center py-8 font-sans text-ink/50">Nenhuma confirmação ainda.</td>
                                          </tr>
                                      )}
                                  </tbody>
                                  </table>
                              </div>
                          </div>
                      )}
                  </div>
                  
                  {view !== 'rsvps' && (
                    <div className="pt-8 mt-auto flex justify-end">
                      <Button type="submit" size="lg">
                          <Settings className="mr-2" /> Salvar Alterações
                      </Button>
                    </div>
                  )}

                </form>
              )}
            </main>
        </div>
    </div>
  );
};

export default AdminPanel;
