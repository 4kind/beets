mpi
===

To start the web interface run ``beet mpi``.

Developer
---------

To run and debug the application in PyCharm you can use the following configuration.

* open `Run/Debug Configurations`
* create new Flask server configuration
* Target: ``<ProjectDir>\beets\beetsplug\mpi``
* Environment Variables: ``FLASK_APP=beetsplug.mpi``