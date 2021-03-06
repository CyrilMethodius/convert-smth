import { DataSource } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { map, delay } from 'rxjs/operators'
import { Observable, of as observableOf, merge } from 'rxjs'
import { AircraftDigestPlain, Digest } from './aircraft.digest.plain'
import { fullAircraftsList } from 'src/app/_data/avia/aircrafts/start-data'
import { ICompare } from 'src/app/_core/sorting/compare'

export class AircraftsDescrTableDataSource extends DataSource<AircraftDigestPlain> {
  data: AircraftDigestPlain[] = []
  paginator: MatPaginator
  sort: MatSort

  isLoading = false
  readonly #msSimulatedDelay = 1000

  constructor(private comparer: ICompare) {
    super()
  }

  /**
   * Connect this data source to the table. The table will only update when the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AircraftDigestPlain[]> {
    this.isLoading = true
    this.data = fullAircraftsList.map(x => Digest.flatten(x))

    // Combine everything that affects the rendered data into one update stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ]

    const obs = merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]))
    }), delay(this.#msSimulatedDelay))
    obs.subscribe(_ => this.isLoading = false)

    return obs
  }

  convert(schemeId: string) {
    this.isLoading = true
    setTimeout(() => { this.isLoading = false }, this.#msSimulatedDelay)
  }

  disconnect() {
    // clean up connections
    // free held resource
  }

  /**
   * Paginate the data (client-side). If server-side replace by request to the server.
   */
  private getPagedData(data: AircraftDigestPlain[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize
    return data.splice(startIndex, this.paginator.pageSize)
  }

  /**
   * Sort the data (client-side). If server-side replace by request to the server.
   */
  private getSortedData(data: AircraftDigestPlain[]) {
    const propName = this.sort.active
    if (!propName || !this.sort.direction) {
      return data
    }

    return data.sort((a, b) => {
      
      const bubble = this.comparer.whirl(a[propName], b[propName])
      return this.sort.direction !== 'asc' ? -1 * bubble : bubble
    })
  }
}