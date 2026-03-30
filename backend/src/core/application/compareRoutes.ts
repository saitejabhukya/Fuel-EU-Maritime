export function compareRoutes(baseline: any, routes: any[]) {
  return routes.map(r => {
    const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

    return {
      ...r,
      percentDiff,
      compliant: r.ghgIntensity <= 89.3368
    };
  });
}