"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectionRegister = void 0;
const core_data_1 = require("@kartoffelgames/core.data");
const inject_mode_1 = require("../enum/inject-mode");
const decoration_history_1 = require("../reflect/decoration-history");
const metadata_1 = require("../metadata/metadata");
class InjectionRegister {
    static createObject(pConstructor, pForceCreateOrLocalInjections, pLocalInjections) {
        // Decide between local injection or force creation parameter.
        let lLocalInjections;
        let lForceCreate;
        if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
            lForceCreate = false;
            lLocalInjections = pForceCreateOrLocalInjections;
        }
        else {
            lForceCreate = !!pForceCreateOrLocalInjections;
            lLocalInjections = pLocalInjections ?? new core_data_1.Dictionary();
        }
        // Find constructor in decoration history that was used for registering. Only root can be registered.
        let lRegisteredConstructor = decoration_history_1.DecorationHistory.getRootOf(pConstructor);
        if (!InjectionRegister.mInjectableConstructor.has(lRegisteredConstructor)) {
            throw new core_data_1.Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, InjectionRegister);
        }
        // Replace current constructor with global replacement.
        let lConstructor;
        if (InjectionRegister.mInjectableReplacement.has(lRegisteredConstructor)) {
            const lReplacementConstructor = InjectionRegister.mInjectableReplacement.get(lRegisteredConstructor);
            lConstructor = lReplacementConstructor;
            // Set replacement constructor that was used for registering. Is allways registered.
            lRegisteredConstructor = decoration_history_1.DecorationHistory.getRootOf(lReplacementConstructor);
        }
        else {
            lConstructor = pConstructor;
        }
        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList = metadata_1.Metadata.get(lRegisteredConstructor).parameterTypes;
        if (!lParameterTypeList) {
            lParameterTypeList = new Array();
        }
        // Get injection mode.
        const lInjecttionMode = InjectionRegister.mInjectMode.get(lRegisteredConstructor);
        // Return cached sinleton object if not forced to create a new one.
        if (!lForceCreate && lInjecttionMode === inject_mode_1.InjectMode.Singleton && InjectionRegister.mSingletonMapping.has(lRegisteredConstructor)) {
            return InjectionRegister.mSingletonMapping.get(lRegisteredConstructor);
        }
        // Create parameter.
        const lConstructorParameter = new Array();
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter;
            // Check if parameter can be replaced with an local injection
            if ((lInjecttionMode !== inject_mode_1.InjectMode.Singleton || lForceCreate) && lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            }
            else {
                // Proxy exception.
                try {
                    // Get injectable parameter.
                    lCreatedParameter = InjectionRegister.createObject(lParameterType, lLocalInjections);
                }
                catch (pException) {
                    throw new core_data_1.Exception(`Parameter "${lParameterType.name}" of ${lConstructor.name} is not injectable.\n` + pException.message, InjectionRegister);
                }
            }
            // Add parameter to construction parameter list.
            lConstructorParameter.push(lCreatedParameter);
        }
        // Create object.
        const lCreatedObject = new lConstructor(...lConstructorParameter);
        // Cache singleton objects but only if not forced to create.
        if (!lForceCreate && lInjecttionMode === inject_mode_1.InjectMode.Singleton) {
            InjectionRegister.mSingletonMapping.add(lRegisteredConstructor, lCreatedObject);
        }
        return lCreatedObject;
    }
    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    static registerInjectable(pConstructor, pMode) {
        // Find root constructor of decorated constructor to habe registered constructor allways available top down.
        const lBaseConstructor = decoration_history_1.DecorationHistory.getRootOf(pConstructor);
        // Map constructor.
        InjectionRegister.mInjectableConstructor.add(lBaseConstructor, pConstructor);
        InjectionRegister.mInjectMode.add(lBaseConstructor, pMode);
    }
    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    static replaceInjectable(pOriginalConstructor, pReplacementConstructor) {
        // Find original registered original. Only root can be registerd.
        const lRegisteredOriginal = decoration_history_1.DecorationHistory.getRootOf(pOriginalConstructor);
        if (!InjectionRegister.mInjectableConstructor.has(lRegisteredOriginal)) {
            throw new core_data_1.Exception('Original constructor is not registered.', InjectionRegister);
        }
        // Find replacement registered original. Only root can be registered.
        const lRegisteredReplacement = decoration_history_1.DecorationHistory.getRootOf(pReplacementConstructor);
        if (!InjectionRegister.mInjectableConstructor.has(lRegisteredReplacement)) {
            throw new core_data_1.Exception('Replacement constructor is not registered.', InjectionRegister);
        }
        // Register replacement.
        InjectionRegister.mInjectableReplacement.set(lRegisteredOriginal, pReplacementConstructor);
    }
}
exports.InjectionRegister = InjectionRegister;
InjectionRegister.mInjectMode = new core_data_1.Dictionary();
InjectionRegister.mInjectableConstructor = new core_data_1.Dictionary();
InjectionRegister.mInjectableReplacement = new core_data_1.Dictionary();
InjectionRegister.mSingletonMapping = new core_data_1.Dictionary();
//# sourceMappingURL=injection-register.js.map