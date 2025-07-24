// apiRouteChecker.js - Helper tool to identify API route discrepancies
console.log("API Route Checker - Helping debug API endpoint mismatches");

// Backend routes from app.js analysis
const backendRoutes = {
  // Product routes
  product: [
    { path: "/api/v1/products", methods: ["GET", "POST"] },
    {
      path: "/api/v1/products/:id",
      methods: ["GET", "PUT", "DELETE", "PATCH"],
    },
    { path: "/api/v1/productsDownload", methods: ["GET"] },
    { path: "/api/v1/imageDownload/:filename", methods: ["GET"] },
    { path: "/api/v1/bulkUpload", methods: ["POST"] },
  ],

  // Category routes
  category: [
    { path: "/api/v1/category", methods: ["GET", "POST"] },
    {
      path: "/api/v1/category/:id",
      methods: ["GET", "PUT", "DELETE", "PATCH"],
    },
  ],

  // Brand routes
  brand: [
    { path: "/api/v1/brand", methods: ["GET", "POST"] },
    { path: "/api/v1/brand/:id", methods: ["GET", "DELETE"] },
  ],
};

// Frontend routes being used (from code analysis)
const frontendRoutes = {
  product: ["/api/v1/product", "/api/v1/products"],
  category: ["/api/v1/category", "/api/v1/categories"],
  brand: ["/api/v1/brand", "/api/v1/brands"],
};

// Check for discrepancies
console.log("Analyzing API route discrepancies...");
console.log("-----------------------------------");

// Compare backend and frontend routes
for (const [entityType, routes] of Object.entries(frontendRoutes)) {
  console.log(`Entity: ${entityType}`);
  console.log("Frontend is trying to access:");
  routes.forEach((route) => console.log(`  - ${route}`));

  console.log("Backend actually provides:");
  if (backendRoutes[entityType]) {
    backendRoutes[entityType].forEach((route) =>
      console.log(`  - ${route.path} [${route.methods.join(", ")}]`)
    );
  } else {
    console.log("  - No routes defined!");
  }

  // Identify mismatches
  const backendPaths = backendRoutes[entityType]?.map((r) => r.path) || [];
  const mismatches = routes.filter(
    (r) => !backendPaths.some((bp) => bp === r || bp.replace("/:id", "") === r)
  );

  if (mismatches.length > 0) {
    console.log("⚠️ Mismatches detected:");
    mismatches.forEach((mismatch) => {
      console.log(
        `  - Frontend uses "${mismatch}" but backend doesn't have an exact match`
      );

      // Suggest possible fixes
      const suggestions = backendPaths.filter(
        (bp) =>
          bp.includes(entityType) ||
          bp.includes(entityType.replace(/s$/, "")) ||
          bp.includes(entityType + "s")
      );

      if (suggestions.length > 0) {
        console.log("    Possible alternatives:");
        suggestions.forEach((s) => console.log(`    → ${s}`));
      }
    });
  } else {
    console.log("✅ No mismatches detected for this entity type");
  }

  console.log("-----------------------------------");
}

// Generate fix suggestions
console.log("RECOMMENDED FIXES:");
console.log(
  '1. Update frontend to use "/api/v1/products" instead of "/api/v1/product"'
);
console.log(
  '2. Update frontend to use "/api/v1/category" (singular) as it appears in backend'
);
console.log(
  '3. Update frontend to use "/api/v1/brand" (singular) as it appears in backend'
);
console.log("");
console.log("OR");
console.log("");
console.log(
  "1. Add route aliases in backend to support both singular and plural endpoints"
);
console.log(
  '   e.g. app.use("/api/v1/product", productRouter) in addition to existing routes'
);
console.log("");
console.log("IMPLEMENTATION PRIORITY:");
console.log(
  "1. First fix the product routes - this is most critical for dashboard stats"
);
console.log("2. Then fix category and brand routes");
