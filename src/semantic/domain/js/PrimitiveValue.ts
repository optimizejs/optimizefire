import {RuleExpression} from '../../rules/expression/RuleExpression';
import {RuleParamExpression, SimpleCalculator} from '../../rules/expression/RuleParamExpression';
import {JSValue, Type} from './JSValue';

export class PrimitiveValue extends JSValue {
    constructor(readonly value: primitive) {
        super();
    }

    getType(): Type {
        switch (typeof this.value) {
            case 'undefined':
                return Type.UNDEFINED;
            case 'object':
                return Type.NULL;
            case 'boolean':
                return Type.BOOLEAN;
            case 'string':
                return Type.STRING;
            case 'symbol':
                return Type.SYMBOL;
            case 'number':
                return Type.NUMBER;
        }
        throw new Error('Unknown type');
    }
}

export type Prim = PrimitiveValue;
export type PrimExpr = RuleExpression<Prim>;

export function isPrimitive(value: RuleExpression<JSValue>): RuleExpression<boolean> {
    return new RuleParamExpression(new SimpleCalculator(arg => arg instanceof PrimitiveValue), value);
}

export function is(value: RuleExpression<PrimitiveValue>, target: primitive): RuleExpression<boolean> {
    return new RuleParamExpression<boolean, PrimitiveValue>(
        new SimpleCalculator(arg => arg.value === target),
        value
    );
}
