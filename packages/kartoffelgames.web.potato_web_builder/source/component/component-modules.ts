import { TextNode, XmlAttribute, XmlElement } from '@kartoffelgames/core.xml';
import { ExpressionModule } from '../module/expression-module';
import { MultiplicatorModule } from '../module/multiplicator-module';
import { StaticModule } from '../module/static-module';
import { MustacheExpressionModule } from '../default/mustache_expression/mustache-expression-module';
import { ModuleType } from '../module/enum/module-type';
import { IPwbExpressionModuleClass, IPwbMultiplicatorModuleClass, IPwbStaticModuleClass } from '../module/interface/module';
import { Modules } from '../module/modules';
import { ComponentManager } from './component-manager';
import { LayerValues } from './values/layer-values';

// Import default modules
import '../default/component-event/component-event-attribute-module';
import '../default/pwb_for_of/for-of-manipulator-attribute-module';
import '../default/pwb_child/pwb-child-attribute-module';
import '../default/pwb_if/if-manipulator-attribute-module';
import '../default/one_way_binding/one-way-binding-attribute-module';
import '../default/slot_attribute/slot-attribute-module';
import '../default/two_way_binding/two-way-binding-attribute-module';

export class ComponentModules {
    private readonly mComponentManager: ComponentManager;
    private readonly mExpressionModule: IPwbExpressionModuleClass;

    /**
     * Constructor.
     * @param pExpressionModule - default expression module for this component. 
     * @param pComponentManager - Component manager.
     */
    public constructor(pComponentManager: ComponentManager, pExpressionModule?: IPwbExpressionModuleClass) {
        // Get expression module.
        this.mExpressionModule = pExpressionModule ?? <IPwbExpressionModuleClass><any>MustacheExpressionModule;
        this.mComponentManager = pComponentManager;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Template element.
     * @param pValues - Values of current layer.
     */
    public getElementMultiplicatorModule(pTemplate: XmlElement, pValues: LayerValues): MultiplicatorModule {
        // Find manipulator module inside attributes.
        for (const lDefinition of Modules.moduleDefinitions) {
            // Only manipulator modules.
            if (lDefinition.type === ModuleType.Manipulator) {
                for (const lAttribute of pTemplate.attributeList) {
                    if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                        // Get constructor and create new module.
                        const lModule: MultiplicatorModule = new MultiplicatorModule({
                            moduleDefinition: lDefinition,
                            moduleClass: <IPwbMultiplicatorModuleClass>Modules.getModuleClass(lDefinition),
                            targetTemplate: pTemplate,
                            targetAttribute: lAttribute,
                            values: pValues,
                            componentManager: this.mComponentManager,
                        });

                        return lModule;
                    }
                }
            }
        }
    }

    /**
     * Get all static modules of template.
     * @param pTemplate - Template
     * @param pElement - Build template.
     * @param pValues - Layer values.
     */
    public getElementStaticModules(pTemplate: XmlElement, pElement: Element, pValues: LayerValues): Array<ExpressionModule | StaticModule> {
        const lModules: Array<ExpressionModule | StaticModule> = new Array<ExpressionModule | StaticModule>();

        // Find static modules inside attributes.
        for (const lAttribute of pTemplate.attributeList) {
            let lModuleFound: boolean = false;

            // Find static modules.
            for (const lDefinition of Modules.moduleDefinitions) {
                if (lDefinition.type === ModuleType.Static && lDefinition.selector.test(lAttribute.qualifiedName)) {
                    // Get constructor and create new module.
                    const lModule: StaticModule = new StaticModule({
                        moduleDefinition: lDefinition,
                        moduleClass: <IPwbStaticModuleClass>Modules.getModuleClass(lDefinition),
                        targetTemplate: pTemplate,
                        targetAttribute: lAttribute,
                        values: pValues,
                        componentManager: this.mComponentManager,
                        targetNode: pElement
                    });

                    lModules.push(lModule);
                    lModuleFound = true;
                    break;
                }
            }

            // When no static module is found, use expression module.
            if (!lModuleFound) {
                const lModule: ExpressionModule = new ExpressionModule({
                    moduleDefinition: Modules.getModuleDefinition(this.mExpressionModule),
                    moduleClass: this.mExpressionModule,
                    targetTemplate: pTemplate,
                    targetAttribute: lAttribute,
                    values: pValues,
                    componentManager: this.mComponentManager,
                    targetNode: pElement
                });

                lModules.push(lModule);
            }
        }

        return lModules;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Key list for possible multiplicator modules.
     */
    public getMultiplicatorAttribute(pTemplate: XmlElement): XmlAttribute {
        // Find manipulator module inside attributes.
        for (const lDefinition of Modules.moduleDefinitions) {
            // Only manipulator modules.
            if (lDefinition.type === ModuleType.Manipulator) {
                for (const lAttribute of pTemplate.attributeList) {
                    if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                        return lAttribute;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Text node template.
     * @param pTextNode - Build text node.
     * @param pValues - Values of current layer.
     */
    public getTextExpressionModule(pTemplate: TextNode, pTextNode: Text, pValues: LayerValues): ExpressionModule {
        const lModule: ExpressionModule = new ExpressionModule({
            moduleDefinition: Modules.getModuleDefinition(this.mExpressionModule),
            moduleClass: this.mExpressionModule,
            targetTemplate: pTemplate,
            values: pValues,
            componentManager: this.mComponentManager,
            targetNode: pTextNode
        });

        return lModule;
    }
}