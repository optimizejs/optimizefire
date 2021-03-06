import {RestElement} from 'estree';
import {types} from 'recast';
import {toRule} from '../../../RuleMapper';
import {CompletionRecord} from '../../domain/CompletionRecords';
import {RuleExpression, trackOptimized} from '../../rules/expression/RuleExpression';
import {inNewScope, RuleLetStatement} from '../../rules/RuleStatements';

export function RestElement(node: RestElement): RuleExpression<CompletionRecord> {
    const argument = trackOptimized(toRule(node.argument));
    return inNewScope([
            new RuleLetStatement('argument', argument)
        ],
        () => types.builders.restElement(argument.toNode())
    ); // TODO
}
