#!/bin/bash
# Type Safety Verification Script

echo "🔍 Verifying TypeScript Type Safety..."
echo ""

# Check for 'as any' usage
echo "1. Checking for type assertion hacks..."
ANY_COUNT=$(grep -r "as any" app/ src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
if [ "$ANY_COUNT" -eq 0 ]; then
  echo "   ✅ No 'as any' type assertions found"
else
  echo "   ⚠️  Found $ANY_COUNT instances of 'as any'"
  grep -r "as any" app/ src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules
fi

echo ""
echo "2. Checking for eslint-disable comments..."
DISABLE_COUNT=$(grep -r "eslint-disable" app/ src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
if [ "$DISABLE_COUNT" -eq 0 ]; then
  echo "   ✅ No ESLint disable comments found"
else
  echo "   ℹ️  Found $DISABLE_COUNT ESLint disable comments (review if needed)"
fi

echo ""
echo "3. Running TypeScript compilation..."
if npx tsc --noEmit --pretty 2>&1 | grep -q "error TS"; then
  echo "   ❌ TypeScript errors found"
  npx tsc --noEmit --pretty
else
  echo "   ✅ TypeScript compilation successful"
fi

echo ""
echo "4. Running ESLint..."
if npm run lint 2>&1 | grep -q "Error:"; then
  echo "   ⚠️  ESLint warnings/errors found"
else
  echo "   ✅ ESLint validation passed"
fi

echo ""
echo "5. Testing build..."
if npm run build > /dev/null 2>&1; then
  echo "   ✅ Production build successful"
else
  echo "   ❌ Production build failed"
fi

echo ""
echo "✨ Verification complete!"
