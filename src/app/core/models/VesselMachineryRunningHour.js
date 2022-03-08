import Machinery from './Machinery';
import RunningHour from './RunningHour';
import Vessel from './Vessel';

export default function VesselMachineryRunningHour(data = {}) {
  this.id = data.id ? data.id : 0;
  this.installed_date = data.installed_date ? data.installed_date : '';
  this.vessel = data.vessel ? new Vessel(data.vessel) : new Vessel();
  this.machinery = data.machinery ? new Machinery(data.machinery) : new Machinery();
  this.current_running_hour = data.current_running_hour
    ? new RunningHour(data.current_running_hour)
    : new RunningHour();
  this.running_hour_history = data.running_hour_history
    ? data.running_hour_history.map(runningHour => new RunningHour(runningHour))
    : []
}
