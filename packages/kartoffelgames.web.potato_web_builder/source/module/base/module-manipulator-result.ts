import { Exception, List } from '@kartoffelgames/core.data';
import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { ComponentValues } from '../../component/component-values';

/**
 * Results for html manipulator attribute module.
 */
export class ModuleManipulatorResult {
    private readonly mElementList: Array<ManipulatorElement>;

    /**
     * Get list of created elements.
     */
    public get elementList(): Array<ManipulatorElement> {
        return List.newListWith(...this.mElementList);
    }

    /**
     * Constructor.
     * Initialize new html manipulator attribute module result.
     */
    public constructor() {
        // Initialize list.
        this.mElementList = new Array<ManipulatorElement>();
    }

    /**
     * Add new element to result.
     * @param pTemplateElement - New template element. Can't use same template for multiple elements.
     * @param pValues - New Value handler of element with current value handler as parent.
     */
    public addElement(pTemplateElement: BaseXmlNode, pValues: ComponentValues): void {
        // Check if value or temple is used in another element.
        const lDoubledIndex: number = this.mElementList.findIndex(pElement => {
            return pElement.template === pTemplateElement || pElement.componentValues === pValues;
        });

        // Do not allow double use of template or value handler.
        if (lDoubledIndex === -1) {
            this.mElementList.push({ template: pTemplateElement, componentValues: pValues });
        } else {
            throw new Exception("Can't add same template or value handler for multiple Elements.", this);
        }
    }
}

/**
 * Result element of manipulator module.
 */
export type ManipulatorElement = {
    template: BaseXmlNode;
    componentValues: ComponentValues;
};