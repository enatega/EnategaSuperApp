#!/usr/bin/env node
/**
 * @stripe/stripe-react-native ships an iOS shim that forward-declares
 * STPPaymentStatus as NS_ENUM(NSUInteger, ...), but the Swift enum is
 * `@objc public enum STPPaymentStatus: Int` in StripePayments. The
 * Swift-generated header therefore emits SWIFT_ENUM_FWD_DECL(NSInteger, ...),
 * and clang fails with:
 *
 *   Enumeration redeclared with different underlying type 'NSInteger'
 *   (aka 'long') (was 'NSUInteger')
 *
 * Rewrite the shim to NSInteger. Idempotent; safe to re-run.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@stripe',
  'stripe-react-native',
  'ios',
  'StripeSwiftInterop.h'
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
const patched = source.replace(
  'typedef NS_ENUM(NSUInteger, STPPaymentStatus);',
  'typedef NS_ENUM(NSInteger, STPPaymentStatus);'
);

if (patched !== source) {
  fs.writeFileSync(target, patched);
  console.log('[patch-stripe-ios] STPPaymentStatus forward declaration -> NSInteger');
}
