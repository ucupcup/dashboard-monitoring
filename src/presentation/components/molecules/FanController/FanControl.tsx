import React from "react";
import { Card } from "../../../components/atoms/Card/Card";
import { Toggle } from "../../../components/atoms/Toggle/Toggle";
import { Button } from "../../../components/atoms/Button/Button";
import { useFanControl } from "../../../../app/hooks/useFanControl";
import { useFan, useManualMode } from "../../../../app/store/dashboardStore";

export const FanController: React.FC = () => {
  const fan = useFan();
  const manualMode = useManualMode();
  const { controlFan } = useFanControl();

  const handleFanToggle = async () => {
    if (!fan || !manualMode) return;
    const newState = fan.isOn() ? "off" : "on";
    await controlFan(newState);
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Fan Control</h3>
          <div className="space-y-4">
            <Toggle isOn={fan?.isOn() || false} onToggle={handleFanToggle} disabled={!manualMode} label="Fan Switch" />
            <div className="flex gap-2">
              <Button variant="success" size="sm" onClick={() => controlFan("on")} disabled={!manualMode}>
                Turn On
              </Button>
              <Button variant="danger" size="sm" onClick={() => controlFan("off")} disabled={!manualMode}>
                Turn Off
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
