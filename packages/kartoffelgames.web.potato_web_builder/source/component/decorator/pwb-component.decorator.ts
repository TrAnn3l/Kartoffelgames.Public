import { InjectionConstructor, Injector, Metadata } from '@kartoffelgames/core.dependency-injection';
import { IPwbExpressionModuleClass, IPwbMultiplicatorModuleClass, IPwbStaticModuleClass } from '../../module/interface/module';
import { ComponentManager } from '../component-manager';
import { UpdateScope } from '../enum/update-scope';
import { UserClass } from '../interface/user-class';

/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
export function PwbComponent(pParameter: HtmlComponentParameter): any {
    // Needs constructor without argument.
    return (pUserClassConstructor: UserClass) => {
        // Set user class to be injectable.
        Injector.Injectable(pUserClassConstructor);

        // Set element metadata.
        Metadata.get(pUserClassConstructor).setMetadata(ComponentManager.METADATA_SELECTOR, pParameter.selector);

        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            private readonly mComponentManager: ComponentManager;

            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            public constructor() {
                super();

                // Create component handler.
                this.mComponentManager = new ComponentManager(
                    pUserClassConstructor,
                    pParameter.template,
                    pParameter.expressionmodule,
                    this,
                    pParameter.updateScope
                );

                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    this.mComponentManager.addStyle(pParameter.style);
                }
            }

            /**
             * Lifecycle callback.
             * Callback when element get attached to dom.
             */
            public connectedCallback(): void {
                this.mComponentManager.connected();
            }

            /**
             * Lifecycle callback.
             * Callback when element get detached from dom.
             */
            public disconnectedCallback(): void {
                this.mComponentManager.disconnected();
            }
        };

        // Define current element as new custom html element.
        window.customElements.define(pParameter.selector, lPwbComponentConstructor);
    };
}

/**
 * Html component parameter.
 */
type HtmlComponentParameter = {
    expressionmodule?: IPwbExpressionModuleClass | any;
    style?: string,
    selector: string;
    template?: string;
    // Placeholder for listing modules that should be imported.
    modules?: Array<IPwbMultiplicatorModuleClass | IPwbStaticModuleClass | any>;
    // Placeholder for listing components that should be imported.
    components?: Array<InjectionConstructor>;
    updateScope?: UpdateScope;
};
