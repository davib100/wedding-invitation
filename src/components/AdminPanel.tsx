
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar as CalendarIcon, LogOut, ListChecks, Info, MapPin, X, Loader2, Save, Palette } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { WeddingSettings, RSVP } from '../../types';
import { saveSettings, getSettings } from '../services/storageService';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '../lib/utils';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import InteractiveMap from './InteractiveMap';
import { useToast } from '../hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdate: () => void;
}

type AdminView = 'general' | 'event' | 'personalization' | 'rsvps';

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
  const { toast } = useToast();

  const handleLogout = async () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    await signOut(auth);
    onClose();
  };

  useIdleTimeout(handleLogout, 3600000); 

  const fetchSettingsOnMount = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const currentSettings = await getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error("Failed to fetch settings on mount:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
        className: "bg-paper border-destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, toast]);

  useEffect(() => {
    fetchSettingsOnMount();

    if (!isOpen) return;
    
    const fetchRsvps = async () => {
      const { data, error } = await supabase.from('rsvps').select('*').order('firstName', { ascending: true });
      if (error) {
        console.error("Error fetching RSVPs:", error);
      } else if (data) {
        setRsvps(data as RSVP[]);
      }
    };
    fetchRsvps();

    const channel = supabase
      .channel('rsvps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, (payload) => {
          console.log('Change received!', payload);
          fetchRsvps();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, fetchSettingsOnMount]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleColorPaletteChange = (index: number, color: string) => {
    setSettings(prev => {
      const newPalette = [...(prev.colorPalette || [])];
      newPalette[index] = color;
      return { ...prev, colorPalette: newPalette };
    });
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
      toast({
        title: "Sucesso!",
        description: "As configurações foram salvas.",
        className: "bg-paper border-green-300 text-green-800",
      });
      onSettingsUpdate(); // Notify App.tsx to refetch
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Erro ao Salvar",
        description: `Não foi possível salvar. Motivo: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
        className: "bg-paper border-destructive",
      });
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
      <Button variant={view === 'personalization' ? 'secondary' : 'ghost'} className="justify-start w-full" onClick={() => setView('personalization')}><Palette className="mr-2 h-4 w-4"/> Personalização</Button>
      <Button variant={view === 'rsvps' ? 'secondary' : 'ghost'} className="justify-start w-full" onClick={() => setView('rsvps')}><ListChecks className="mr-2 h-4 w-4"/> Convidados</Button>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 p-0 sm:p-4 animate-fade-in">
      <div className="container mx-auto bg-paper bg-paper-texture rounded-none sm:rounded-xl shadow-2xl h-full flex overflow-hidden border-0 sm:border border-gold/20">
        
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

          <main className="flex-1 overflow-y-auto relative">
            <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-4 right-4 text-ink/60 hover:text-ink z-10 hidden sm:inline-flex">
              <X />
            </Button>

            {isLoading ? (
              <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
            ) : (
              <form onSubmit={handleSettingsSubmit} className="h-full flex flex-col">
                <div className="flex-grow p-4 sm:p-8 space-y-8 pb-24">
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
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={settings.eventDate ? new Date(settings.eventDate) : undefined}
                                    onSelect={handleDateChange}
                                    initialFocus
                                  />
                                </PopoverContent>
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
                        <CardHeader><CardTitle>Localização do Evento</CardTitle></CardHeader>
                        <CardContent>
                          <div>
                            <Label htmlFor="eventLocation">Nome do Local</Label>
                            <Input 
                              id="eventLocation" 
                              name="eventLocation" 
                              value={settings.eventLocation || ''} 
                              onChange={handleSettingsChange} 
                              placeholder="Ex: Villa Giardini"
                            />
                          </div>
                          <div>
                            <Label htmlFor="eventAddress">Endereço do Evento</Label>
                            <Textarea 
                              id="eventAddress" 
                              name="eventAddress" 
                              value={settings.eventAddress || ''} 
                              onChange={handleSettingsChange} 
                              placeholder="Ex: St. de Mansões Park Way Q 3 - Núcleo Bandeirante, Brasília - DF"
                            />
                          </div>
                          <div>
                            <Label htmlFor="eventAddressReference">Ponto de Referência</Label>
                            <Input 
                              id="eventAddressReference" 
                              name="eventAddressReference" 
                              value={settings.eventAddressReference || ''} 
                              onChange={handleSettingsChange} 
                              placeholder="Ex: Próximo à ponte"
                            />
                          </div>
                          <div>
                            <Label>Coordenadas do Mapa</Label>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label htmlFor="mapLat" className="text-xs">Latitude</Label>
                                <Input 
                                  id="mapLat"
                                  type="number"
                                  step="any"
                                  name="lat"
                                  value={settings.mapCoordinates?.lat || ''}
                                  onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    mapCoordinates: {
                                      lat: parseFloat(e.target.value) || 0,
                                      lng: prev.mapCoordinates?.lng || 0
                                    }
                                  }))}
                                  placeholder="-15.7801"
                                />
                              </div>
                              <div>
                                <Label htmlFor="mapLng" className="text-xs">Longitude</Label>
                                <Input 
                                  id="mapLng"
                                  type="number"
                                  step="any"
                                  name="lng"
                                  value={settings.mapCoordinates?.lng || ''}
                                  onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    mapCoordinates: {
                                      lat: prev.mapCoordinates?.lat || 0,
                                      lng: parseFloat(e.target.value) || 0
                                    }
                                  }))}
                                  placeholder="-47.9292"
                                />
                              </div>
                            </div>
                            <Label>Clique no mapa para definir a localização</Label>
                            {settings.mapCoordinates && (
                              <InteractiveMap 
                                coordinates={settings.mapCoordinates}
                                onMapClick={(coords) => setSettings(prev => ({
                                  ...prev,
                                  mapCoordinates: coords
                                }))}
                              />
                            )}
                            {!settings.mapCoordinates && (
                              <div className="bg-gray-100 h-[400px] flex items-center justify-center text-gray-500 rounded border border-dashed">
                                Digite as coordenadas acima ou clique no mapa
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {view === 'personalization' && (
                    <div className="animate-fade-in space-y-8">
                      <Card>
                        <CardHeader><CardTitle>Paleta de Cores</CardTitle></CardHeader>
                        <CardContent>
                          <div>
                            <Label htmlFor="colorPaletteText">Texto da Paleta</Label>
                            <Input
                              id="colorPaletteText"
                              name="colorPaletteText"
                              value={settings.colorPaletteText || ''}
                              onChange={handleSettingsChange}
                              placeholder="Ex: Terracota & Verde Oliva"
                            />
                          </div>
                          <div>
                            <Label>Cores</Label>
                            <div className="flex items-center gap-4 mt-2">
                              {(settings.colorPalette || []).map((color, index) => (
                                <div key={index} className="flex flex-col items-center gap-2">
                                  <Label htmlFor={`color-${index}`} className="text-xs">Cor {index + 1}</Label>
                                  <Input
                                    id={`color-${index}`}
                                    type="color"
                                    value={color}
                                    onChange={(e) => handleColorPaletteChange(index, e.target.value)}
                                    className="w-16 h-16 p-1"
                                  />
                                </div>
                              ))}
                            </div>
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
                  <div className="sticky bottom-0 bg-paper/80 backdrop-blur-sm p-4 border-t border-gold/10 flex justify-end">
                     <Button type="submit" size="lg" disabled={isSaving} className="bg-gold hover:bg-gold-dark text-white shadow-lg w-full sm:w-auto">
                      {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
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
