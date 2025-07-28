// src/components/simulator/SimulatorControls.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PRESET_STRATEGIES, SCENARIO_PRESETS } from '@/lib/constants';
import { SimulationSettings } from '@/app/retirement-simulator/page';
import React from 'react';

interface SimulatorControlsProps {
  settings: SimulationSettings;
  setSettings: React.Dispatch<React.SetStateAction<SimulationSettings>>;
}

export function SimulatorControls({ settings, setSettings }: SimulatorControlsProps) {
  
  const handleSettingsChange = (field: keyof SimulationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePresetChange = (presetName: string) => {
    if (presetName === "Custom") return;
    const preset = SCENARIO_PRESETS[presetName as keyof typeof SCENARIO_PRESETS];
    setSettings(prev => ({
      ...prev,
      startCapital: preset.startCapital,
      annualWithdrawal: preset.annualWithdrawal,
      selectedStrategies: preset.strategies,
      annualIncome: 0,
      incomeYears: 0,
    }));
  };

  const toggleAllStrategies = () => {
    const allStrategyKeys = Object.keys(PRESET_STRATEGIES);
    if (settings.selectedStrategies.length === allStrategyKeys.length) {
      handleSettingsChange('selectedStrategies', []); // Deselect all
    } else {
      handleSettingsChange('selectedStrategies', allStrategyKeys); // Select all
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader><CardTitle>Simulation Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Start */}
          <div>
            <Label>Quick Start</Label>
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger><SelectValue placeholder="Load a scenario..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Custom">Custom</SelectItem>
                {Object.keys(SCENARIO_PRESETS).map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Period */}
          <div className="space-y-4">
            <Label>Time Period: {settings.startYear} - {settings.endYear}</Label>
            <Slider value={[settings.startYear, settings.endYear]} min={1990} max={2025} step={1} onValueChange={([start, end]) => setSettings(p => ({...p, startYear: start, endYear: end}))} />
          </div>

          {/* Financials */}
          <div className="space-y-4">
            <h3 className="font-medium">Financials</h3>
            <div>
              <Label htmlFor="capital">Starting Capital (£)</Label>
              <Input id="capital" type="number" value={settings.startCapital} onChange={e => handleSettingsChange('startCapital', Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="income">Annual Income (£)</Label>
              <Input id="income" type="number" value={settings.annualIncome} onChange={e => handleSettingsChange('annualIncome', Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="incomeYears">Income Years</Label>
              <Input id="incomeYears" type="number" value={settings.incomeYears} onChange={e => handleSettingsChange('incomeYears', Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="withdrawal">Annual Spending (£)</Label>
              <Input id="withdrawal" type="number" value={settings.annualWithdrawal} onChange={e => handleSettingsChange('annualWithdrawal', Number(e.target.value))} />
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="inflation" checked={settings.inflationAdj} onCheckedChange={checked => handleSettingsChange('inflationAdj', !!checked)} />
                <Label htmlFor="inflation">Adjust for inflation (2%)</Label>
            </div>
          </div>
          
          {/* Strategies */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Strategies</h3>
              <Button variant="outline" size="sm" onClick={toggleAllStrategies}>
                {settings.selectedStrategies.length === Object.keys(PRESET_STRATEGIES).length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
              {Object.keys(PRESET_STRATEGIES).map(strat => (
                <div key={strat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={strat} 
                    checked={settings.selectedStrategies.includes(strat)}
                    onCheckedChange={checked => {
                      const newSelection = checked 
                        ? [...settings.selectedStrategies, strat] 
                        : settings.selectedStrategies.filter(s => s !== strat);
                      handleSettingsChange('selectedStrategies', newSelection);
                    }}
                  />
                  <Label htmlFor={strat} className="font-normal">{strat}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Market Shock */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="shock" checked={settings.simulateShock} onCheckedChange={checked => handleSettingsChange('simulateShock', !!checked)} />
              <Label htmlFor="shock">Simulate Market Shock</Label>
            </div>
            {settings.simulateShock && (
              <div className="space-y-4">
                <div>
                  <Label>Shock Year: Year {settings.shockYear}</Label>
                  <Slider value={[settings.shockYear]} min={1} max={settings.endYear - settings.startYear + 1} step={1} onValueChange={([val]) => handleSettingsChange('shockYear', val)} />
                </div>
                <div>
                  <Label>Shock Severity: {(settings.shockSeverity * 100).toFixed(0)}%</Label>
                  <Slider value={[settings.shockSeverity]} min={-0.5} max={-0.1} step={0.05} onValueChange={([val]) => handleSettingsChange('shockSeverity', val)} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}