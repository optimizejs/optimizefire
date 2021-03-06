import {readVariable} from '../rules/Basic';
import {RuleExpression} from '../rules/expression/RuleExpression';
import {constant} from '../rules/expression/RuleNoVarExpresion';
import {calculableExpression} from '../rules/expression/RuleParamExpression';
import {RuleIfStatement, RuleLetStatement, RuleReturn, RuleStatement} from '../rules/RuleStatements';
import {JSValue} from './js/JSValue';
import {Label} from './Label';

class Empty {
    empty: true;
}

const EMPTY = new Empty();

export abstract class CompletionRecord {
    private completionRecord: true;
}

export class NormalCompletionRecord extends CompletionRecord {
    constructor(readonly value: JSValue | Empty) {
        super();
    }
}

export class ThrowCompletionRecord extends CompletionRecord {
    constructor(readonly value: JSValue) {
        super();
    }
}

export class ReturnCompletionRecord extends CompletionRecord {
    constructor(readonly value: JSValue) {
        super();
    }
}

export class BreakCompletionRecord extends CompletionRecord {
    constructor(private label: Label | null) {
        super();
    }
}

export class ContinueCompletionRecord extends CompletionRecord {
    constructor(private label: Label | null) {
        super();
    }
}

export const EMPTY_COMPLETION = normalCompletion(constant(EMPTY));

export function isAbrupt(cr: RuleExpression<CompletionRecord>): RuleExpression<boolean> {
    return calculableExpression(arg => !(arg instanceof NormalCompletionRecord), cr);
}

export function getNormalValue(cr: RuleExpression<CompletionRecord>): RuleExpression<JSValue | Empty> {
    return calculableExpression(arg => (arg as NormalCompletionRecord).value, cr);
}

export function normalCompletion(value: RuleExpression<JSValue | Empty>): RuleExpression<NormalCompletionRecord> {
    return calculableExpression<NormalCompletionRecord, JSValue | Empty>(
        arg => new NormalCompletionRecord(arg),
        value
    );
}

export function throwCompletion(value: RuleExpression<JSValue>): RuleExpression<ThrowCompletionRecord> {
    return calculableExpression<ThrowCompletionRecord, JSValue>(arg => new ThrowCompletionRecord(arg), value);
}

export function returnCompletion(value: RuleExpression<JSValue | Empty>): RuleExpression<ReturnCompletionRecord> {
    return calculableExpression<ReturnCompletionRecord, JSValue>(arg => new ReturnCompletionRecord(arg), value);
}

export function isEmptyValue(value: RuleExpression<JSValue | Empty>): RuleExpression<boolean> {
    return calculableExpression(arg => arg === EMPTY, value);
}

export function returnIfAbrupt(variableName: string): RuleStatement {
    return new RuleIfStatement(
        isAbrupt(readVariable(variableName)),
        new RuleReturn(readVariable(variableName)),
        new RuleLetStatement(variableName, getNormalValue(readVariable(variableName)))
    );
}
