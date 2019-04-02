import {CarHeader, getDetails} from "./index";

describe('Details', () => {
   it('should temp', async () => {
      const carHeader:CarHeader = {
         finnkode: '143017926',
         url: 'https://www.finn.no/car/used/ad.html?finnkode=143017926'
      };
      const details = await getDetails([carHeader]);
      // console.log(details);

      // expect(1+1).toEqual(2);
   })
});