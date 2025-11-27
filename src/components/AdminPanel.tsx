
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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

const AdminPanel = () => {
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
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Wedding Settings</h2>
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
          <h2 className="text-2xl font-semibold mb-4">RSVP List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Attending</th>
                  <th className="py-2 px-4 border-b">Guests</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map(rsvp => (
                  <tr key={rsvp.id}>
                    <td className="py-2 px-4 border-b">{rsvp.name}</td>
                    <td className="py-2 px-4 border-b">{rsvp.attending ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border-b">{rsvp.guests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
