
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { getAuth, signOut } from 'firebase/auth';

interface WeddingSettings {
  title: string;
  date: Date;
  brideName: string;
  groomName: string;
  heroImage: string;
  location: string;
  story: string;
}

interface RSVP {
  id: string;
  name: string;
  attending: boolean;
  guests: number;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSettingsUpdate }) => {
  const [settings, setSettings] = useState<WeddingSettings>({
    title: '',
    date: new Date(),
    brideName: '',
    groomName: '',
    heroImage: '',
    location: '',
    story: '',
  });
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Fetch initial settings and RSVPs from your backend
  }, []);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setSettings(prev => ({ ...prev, date }));
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit updated settings to your backend
    console.log('Updated Settings:', settings);
    onSettingsUpdate();
  };
  
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 animate-fade-in overflow-y-auto">
        <div className="container mx-auto p-4 bg-paper rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center mb-4">
                 <h1 className="text-3xl font-bold text-gold-dark font-serif">Admin Panel</h1>
                 <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-ink">Wedding Settings</h2>
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={settings.title} onChange={handleSettingsChange} />
                    </div>
                    <div>
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                    </div>
                    <div>
                    <Label htmlFor="brideName">Bride's Name</Label>
                    <Input id="brideName" name="brideName" value={settings.brideName} onChange={handleSettingsChange} />
                    </div>
                    <div>
                    <Label htmlFor="groomName">Groom's Name</Label>
                    <Input id="groomName" name="groomName" value={settings.groomName} onChange={handleSettingsChange} />
                    </div>
                    <div>
                    <Label htmlFor="heroImage">Hero Image URL</Label>
                    <Input id="heroImage" name="heroImage" value={settings.heroImage} onChange={handleSettingsChange} />
                    </div>
                    <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={settings.location} onChange={handleSettingsChange} />
                    </div>
                    <div>
                    <Label htmlFor="story">Our Story</Label>
                    <Textarea id="story" name="story" value={settings.story} onChange={handleSettingsChange} />
                    </div>
                    <Button type="submit">Save Settings</Button>
                </form>
                </div>

                <div>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-ink">RSVP List</h2>
                <div className="overflow-x-auto bg-paper-dark p-2 rounded-md">
                    <table className="min-w-full bg-white border border-gold/20">
                    <thead>
                        <tr className="bg-paper-dark">
                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Name</th>
                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Attending</th>
                        <th className="py-2 px-4 border-b border-gold/20 text-ink text-left font-serif">Guests</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rsvps.map(rsvp => (
                        <tr key={rsvp.id}>
                            <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.name}</td>
                            <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.attending ? 'Yes' : 'No'}</td>
                            <td className="py-2 px-4 border-b border-gold/10 font-sans text-ink-light">{rsvp.guests}</td>
                        </tr>
                        ))}
                         {rsvps.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-8 font-sans text-ink/50">No RSVPs yet.</td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminPanel;
