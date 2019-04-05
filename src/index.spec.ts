import {CarDetail, CarHeader, getDetails} from "./index";

describe('Details', () => {
   jest.setTimeout(30000);
   it('should temp', async () => {
      const carHeader:CarHeader = {
   finnkode: '141247978',
   url: 'https://www.finn.no/car/used/ad.html?finnkode=141247978'
};
const details:CarDetail[] = await getDetails([carHeader]);
expect(details[0].description).toEqual('Hel og grei Volvo XC70. Bilen har vært i vårt eie siden 2010 og fungert meget bra. Bilen har vært sørvt på Billia hele tiden. Nye bremseskiver og klosser alle hjul. Nye motor fester. Ny diesel varmer. Nye hjullager foran.  Nye sommerdekk, ok vinterdekk. Bilen er selvsagt noe slitt men jeg vil tro dette er en bra bruksbil i mange år til. Napper til tider noe på gearing. Har akkurat flushet automatkassa');
expect(details[0].equipment.length).toEqual(36);
expect(details[0].equipment[0]).toEqual('Sommerhjul');
expect(details[0].properties.length).toEqual(20);
expect(details[0].properties[0]).toEqual('{\"Årsmodell\":\"2006\"}');

})
});