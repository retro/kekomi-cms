Frontend.controllers "/" do

  # daily archive
  get %r{(.*)/archive/([\d]{4})/([\d]{2})/([\d]{2})}, &ArchiveByDayBehavior.handler

  # monthly archive
  get %r{(.*)/archive/([\d]{4})/([\d]{2})}, &ArchiveByMonthBehavior.handler

  # yearly archive
  get %r{(.*)/archive/([\d]{4})}, &ArchiveByYearBehavior.handler

  # if url was not caught with previous archive urls
  # it should just be a 404
  get %r{.*/archive/.*} do
    halt 404
  end

  # list behavior
  get %r{(.*)/list}, &ListBehavior.handler

  get %r{(.*)/list/category/(.*)}, &ListBehavior.handler

  get %r{(.*)/list/tag/(.*)}, &ListBehavior.handler

  get %r{/(.+)}, &PageBehavior.handler

  get :index, &PageBehavior.handler
  
end


