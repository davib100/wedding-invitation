import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar as CalendarIcon, LogOut, ListChecks, Info, MapPin, X, Loader2, Save } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { WeddingSettings, RSVP } from '../../types';
import { saveSettings, getSettings } from '../services/storageService';
import { collection, onSnapshot } from 'firebase/firestore';
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

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("bg-white/50 p-6 rounded-lg shadow-sm border border-gold/20", className)}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mb-6">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="text-2xl font-semibold font-serif text-ink">{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="space-y-6">{children}</div>;

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSettingsUpdate }) => {
  const [settings, setSettings] = useState<Partial<WeddingSettings>>({});
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [view, setView] = useState<AdminView>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    await signOut(auth);
    onClose();
  };

  useIdleTimeout(handleLogout, 3600000); 

  useEffect(() => {
    if (!isOpen) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const currentSettings = await getSettings();
        setSettings(currentSettings);
      } catch (error) {
        console.error("Failed to fetch settings on mount:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();

    const rsvpCollection = collection(db, 'rsvps');
    const unsubscribe = onSnapshot(rsvpCollection, (snapshot) => {
      const rsvpsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RSVP));
      setRsvps(rsvpsData.sort((a, b) => a.firstName.localeCompare(b.firstName))); // Sort RSVPs by name
    }, (error) => {
        console.error("Error fetching RSVPs:", error);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const currentDate = settings.eventDate ? new Date(settings.eventDate) : new Date();
      const newDate = new Date(date);
      newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      setSettings(prev => ({ ...prev, eventDate: newDate.toISOString() }));
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (settings.eventDate && timeValue) {
      const date = new Date(settings.eventDate);
      const [hours, minutes] = timeValue.split(':').map(Number);
      date.setHours(hours, minutes);
      setSettings(prev => ({ ...prev, eventDate: date.toISOString() }));
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings(settings as WeddingSettings);
      onSettingsUpdate();
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const totalGuests = rsvps.reduce((acc, rsvp) => acc + 1 + (rsvp.hasSpouse ? 1 : 0) + (rsvp.childrenCount || 0), 0);

  const navigationButtons = (
    <>
      <Button variant={view === 'general' ? 'secondary' : 'ghost'} className="justify-start w-full" onClick={() => setView('general')}><Info className="mr-2 h-4 w-4"/> Gerais</Button>
      <Button variant={view === 'event' ? 'secondary' : 'ghost'} className="justify-start w-full" onClick={() => setView('event')}><MapPin className="mr-2 h-4 w-4"/> Evento</Button>
      <Button variant={view === 'rsvps' ? 'secondary' : 'ghost'} className="justify-start w-full" onClick={() => setView('rsvps')}><ListChecks className="mr-2 h-4 w-4"/> Convidados</Button>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 p-0 sm:p-4 animate-fade-in">
      <div className="container mx-auto bg-paper bg-paper-texture rounded-none sm:rounded-xl shadow-2xl h-full flex overflow-hidden border-0 sm:border border-gold/20">
        
        {/* --- Sidebar for large screens --- */}
        <aside className="hidden sm:flex flex-col justify-between w-64 bg-paper-dark p-6 border-r border-gold/10">
          <div>
            <h2 className="text-2xl font-bold text-gold-dark font-serif mb-8">Painel</h2>
            <nav className="flex flex-col gap-2">
              {navigationButtons}
            </nav>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="justify-start text-ink/70 hover:text-red-700 hover:bg-red-100/50 mt-8"><LogOut className="mr-2 h-4 w-4"/> Logout</Button>
        </aside>

        <div className="flex-1 flex flex-col">
          {/* --- Header for small screens --- */}
          <header className="sm:hidden p-4 bg-paper-dark border-b border-gold/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gold-dark font-serif">Painel</h2>
              <Button onClick={onClose} variant="ghost" size="icon" className="text-ink/60 hover:text-ink">
                <X />
              </Button>
            </div>
            <nav className="flex justify-center gap-2">
              {navigationButtons}
            </nav>
          </header>

          <main className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
            <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-4 right-4 text-ink/60 hover:text-ink z-10 hidden sm:inline-flex">
              <X />
            </Button>

            {isLoading ? (
              <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
            ) : (
              <form onSubmit={handleSettingsSubmit} className="h-full flex flex-col">
                <div className="flex-grow space-y-8 pb-24"> {/* Padding bottom to avoid overlap with sticky footer */}
                  {view === 'general' && (
                    <div className="animate-fade-in space-y-8">
                      <Card>
                        <CardHeader><CardTitle>Informações dos Noivos</CardTitle></CardHeader>
                        <CardContent>
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="groomName">Nome do Noivo</Label>
                              <Input id="groomName" name="groomName" value={settings.groomName || ''} onChange={handleSettingsChange} />
                            </div>
                            <div>
                              <Label htmlFor="brideName">Nome da Noiva</Label>
                              <Input id="brideName" name="brideName" value={settings.brideName || ''} onChange={handleSettingsChange} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle>Textos do Convite</CardTitle></CardHeader>
                        <CardContent>
                          <div>
                            <Label htmlFor="introText">Texto de Introdução</Label>
                            <Textarea id="introText" name="introText" value={settings.introText || ''} onChange={handleSettingsChange} placeholder="Ex: Com a bênção de Deus e de seus pais" />
                          </div>
                          <div>
                            <Label htmlFor="inviteText">Texto do Convite</Label>
                            <Textarea id="inviteText" name="inviteText" value={settings.inviteText || ''} onChange={handleSettingsChange} placeholder="Ex: Convidam para a celebração de seu casamento" />
                          </div>
                          <div>
                            <Label htmlFor="thankYouText">Texto de Agradecimento</Label>
                            <Textarea id="thankYouText" name="thankYouText" value={settings.thankYouText || ''} onChange={handleSettingsChange} placeholder="Ex: Agradecemos seu carinho e presença" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {view === 'event' && (
                    <div className="animate-fade-in space-y-8">
                      <Card>
                        <CardHeader><CardTitle>Data e Hora</CardTitle></CardHeader>
                        <CardContent>
                          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                            <div className='flex-1 w-full'>
                              <Label>Data do Evento</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !settings.eventDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {settings.eventDate ? new Date(settings.eventDate).toLocaleDateString('pt-BR') : <span>Escolha uma data</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={settings.eventDate ? new Date(settings.eventDate) : undefined} onSelect={handleDateChange} initialFocus /></PopoverContent>
                              </Popover>
                            </div>
                            <div className='sm:w-40 w-full'>
                              <Label>Horário</Label>
                              <Input type="time" value={settings.eventDate ? new Date(settings.eventDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit'}) : ''} onChange={handleTimeChange} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle>Localização</CardTitle></CardHeader>
                        <CardContent>
                          <div>
                            <Label htmlFor="eventLocation">Nome do Local</Label>
                            <Input id="eventLocation" name="eventLocation" value={settings.eventLocation || ''} onChange={handleSettingsChange} />
                          </div>
                          <div>
                            <Label htmlFor="eventAddress">Endereço Completo</Label>
                            <Input id="eventAddress" name="eventAddress" value={settings.eventAddress || ''} onChange={handleSettingsChange} />
                          </div>
                          <div>
                            <Label htmlFor="mapUrl">URL de Incorporação do Google Maps</Label>
                            <Input id="mapUrl" name="mapUrl" value={settings.mapUrl || ''} onChange={handleSettingsChange} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {view === 'rsvps' && (
                    <div className="animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                        <h2 className="text-3xl font-semibold font-serif text-ink">Lista de Convidados</h2>
                        <div className='text-right border border-gold/20 p-3 rounded-lg bg-white/40 shrink-0'>
                          <p className='font-bold text-xl text-gold-dark'>{rsvps.length} confirmações</p>
                          <p className='text-sm text-ink/70'>{totalGuests} pessoas no total</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto bg-white/50 shadow-sm rounded-lg border border-gold/20">
                        <table className="w-full text-sm">
                          <thead className="bg-paper-dark text-left">
                            <tr>
                              {['Nome', 'Acompanhante', 'Crianças', 'Telefone'].map(h => 
                                <th key={h} className="py-3 px-4 border-b border-gold/20 text-ink font-serif font-semibold whitespace-nowrap">{h}</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rsvps.map(rsvp => (
                              <tr key={rsvp.id} className="hover:bg-gold/5 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gold/10 font-sans text-ink-light whitespace-nowrap">{rsvp.firstName} {rsvp.lastName}</td>
                                <td className="py-3 px-4 border-b border-gold/10 font-sans text-ink-light whitespace-nowrap">{rsvp.hasSpouse ? rsvp.spouseName : '-'}</td>
                                <td className="py-3 px-4 border-b border-gold/10 font-sans text-ink-light whitespace-nowrap">{rsvp.hasChildren ? rsvp.childrenCount : '-'}</td>
                                <td className="py-3 px-4 border-b border-gold/10 font-sans text-ink-light whitespace-nowrap">{rsvp.phone}</td>
                              </tr>
                            ))}
                            {rsvps.length === 0 && (
                              <tr><td colSpan={4} className="text-center py-12 font-sans text-ink/50">Nenhuma confirmação ainda.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                
                {view !== 'rsvps' && (
                   <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-paper-dark/80 backdrop-blur-sm border-t border-gold/20">
                    <div className="flex justify-end">
                      <Button type="submit" size="lg" disabled={isSaving} className="bg-gold hover:bg-gold-dark text-white shadow-lg w-full sm:w-auto">
                        {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
