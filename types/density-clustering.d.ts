declare module "density-clustering" {
  export class DBSCAN {
    run(
      dataset: number[][],
      neighborhood_radius: number,
      min_points: number,
    ): number[][];
    noise: number[];
  }

  export class KMEANS {
    run(dataset: number[][], k: number): number[][];
  }

  export class OPTICS {
    run(
      dataset: number[][],
      neighborhood_radius: number,
      min_points: number,
    ): number[][];
  }
}
