import { expect } from 'chai';
import { ExecutionZone } from '../../../../source/change_detection/execution_zone/execution-zone';
import '../../../mock/request-animation-frame-mock-session';

describe('ExecutionZone', () => {
   it('Static Property: current', () => {
      // Process.
      const lCurrentZone: ExecutionZone = ExecutionZone.current;

      // Evaluation.
      expect(lCurrentZone.name).to.equal('Default');
   });

   it('Property: name', () => {
      // Setup.
      const lZoneName: string = 'ZoneName';
      const lZone: ExecutionZone = new ExecutionZone(lZoneName);

      // Process.
      const lNameResult: string = lZone.name;

      // Evaluation.
      expect(lNameResult).to.equal(lZoneName);
   });

   describe('Property: onInteraction', () => {
      it('-- Set value', () => {
         // Setup.
         const lOnInteraction = (): void => { /* Empty */ };
         const lZone: ExecutionZone = new ExecutionZone('Name');

         // Process.
         lZone.onInteraction = lOnInteraction;
         const lOnInteractionResult = lZone.onInteraction;

         // Evaluation.
         expect(lOnInteraction).to.equal(lOnInteractionResult);
      });

      it('-- Empty value', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');

         // Process.
         const lOnInteractionResult = lZone.onInteraction;

         // Evaluation.
         expect(lOnInteractionResult).to.be.null;
      });
   });

   describe('Method: executeInZone', () => {
      it('-- Execute inside zone', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResult: string;
         lZone.executeInZone(() => {
            lZoneNameResult = ExecutionZone.current.name;
         });

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
      });

      it('-- Execute inside zone with parameter', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');
         const lExecutionResult: string = 'ExecutionResult';

         // Process.
         const lResult: string = lZone.executeInZone((pParameter: string) => {
            return pParameter;
         }, lExecutionResult);

         // Evaluation.
         expect(lResult).to.equal(lExecutionResult);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lError: string = 'ErrorName';

         // Process.
         let lZoneNameResult: string;
         let lErrorResult: string;
         try {
            lZone.executeInZone(() => {
               lZoneNameResult = ExecutionZone.current.name;
               throw lError;
            });
         } catch (pError) {
            lErrorResult = pError;
         }

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lErrorResult).to.equal(lError);
      });

      it('-- Error inside zone, ensure correct zones', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResultFunktion: string;
         let lZoneNameResultException: string;
         const lZoneNameResultBefore = ExecutionZone.current.name;
         try {
            lZone.executeInZone(() => {
               lZoneNameResultFunktion = ExecutionZone.current.name;
               throw '';
            });
         } catch (pError) {
            lZoneNameResultException = ExecutionZone.current.name;
         }
         const lZoneNameResultAfter = ExecutionZone.current.name;

         // Evaluation.
         expect(lZoneNameResultBefore).to.equal('Default');
         expect(lZoneNameResultFunktion).to.equal(lZoneName);
         expect(lZoneNameResultException).to.equal('Default');
         expect(lZoneNameResultAfter).to.equal('Default');
      });

      it('-- Check interaction callback', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lFunction = () => { /* Empty */ };

         // Process.
         let lZoneNameResult: string;
         let lExecutedFunction: any;
         lZone.onInteraction = (pZoneName: string, pFunction: (...pArgs: Array<any>) => any, pStacktrace: string) => {
            lZoneNameResult = pZoneName;
            lExecutedFunction = pFunction;
         };
         lZone.executeInZone(lFunction);

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lExecutedFunction).to.equal(lFunction);
      });
   });

   describe('Method: executeInZoneSilent', () => {
      it('-- Execute inside zone', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResult: string;
         lZone.executeInZoneSilent(() => {
            lZoneNameResult = ExecutionZone.current.name;
         });

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
      });

      it('-- Execute inside zone with parameter', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');
         const lExecutionResult: string = 'ExecutionResult';

         // Process.
         const lResult: string = lZone.executeInZoneSilent((pParameter: string) => {
            return pParameter;
         }, lExecutionResult);

         // Evaluation.
         expect(lResult).to.equal(lExecutionResult);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lError: string = 'ErrorName';

         // Process.
         let lZoneNameResult: string;
         let lErrorResult: string;
         try {
            lZone.executeInZoneSilent(() => {
               lZoneNameResult = ExecutionZone.current.name;
               throw lError;
            });
         } catch (pError) {
            lErrorResult = pError;
         }

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lErrorResult).to.equal(lError);
      });

      it('-- Error inside zone, ensure correct zones', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResultFunktion: string;
         let lZoneNameResultException: string;
         const lZoneNameResultBefore = ExecutionZone.current.name;
         try {
            lZone.executeInZoneSilent(() => {
               lZoneNameResultFunktion = ExecutionZone.current.name;
               throw '';
            });
         } catch (pError) {
            lZoneNameResultException = ExecutionZone.current.name;
         }
         const lZoneNameResultAfter = ExecutionZone.current.name;

         // Evaluation.
         expect(lZoneNameResultBefore).to.equal('Default');
         expect(lZoneNameResultFunktion).to.equal(lZoneName);
         expect(lZoneNameResultException).to.equal('Default');
         expect(lZoneNameResultAfter).to.equal('Default');
      });

      it('-- Check interaction callback', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');

         // Process.
         let lInteractionCallbackCalled: boolean = false;
         lZone.onInteraction = () => {
            lInteractionCallbackCalled = true;
         };
         lZone.executeInZoneSilent(() => { /* Empty */ });

         // Evaluation.
         expect(lInteractionCallbackCalled).to.be.false;
      });
   });
});