import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { format } from 'date-fns';

const {greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  scheduleToCloseTimeout: '30s',
});



/** A workflow that simply calls an activity */
export async function getDataFailed(): Promise<Object> {
  try {
    const resultFailed = await greet();
    let Failed = Object(resultFailed)
    return {
      'status': 'success',
      'data': Failed
    }
  } catch (error) {
    return {
      'status': 'error',
      'data': error
    }
  }
}