import { PointService } from "./point.service";
import { IPOINT_SERVICE } from "./point.service.interface";

export const pointServiceProvider = [
  {
    provide: IPOINT_SERVICE,
    useClass: PointService,
  },
];
