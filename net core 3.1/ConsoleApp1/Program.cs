using System;
using System.CodeDom.Compiler;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NServiceBus;

namespace ConsoleApp1
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.Title = "Publisher";

            var config = new EndpointConfiguration("IdentityEndPoint");
            config.SendFailedMessagesTo("IdentityErrors");
            config.EnableInstallers();

            var transport = config.UseTransport<RabbitMQTransport>();
            transport.ConnectionString("host=localhost;username=guest;password=guest");
            transport.UseConventionalRoutingTopology();

            try
            {
                var endpointInstance = await Endpoint.Start(config)
                    .ConfigureAwait(false);

                while (true)
                {
                    var message = Person.Generate();
                    endpointInstance.Publish(message).ConfigureAwait(false).GetAwaiter();
                    
                    Console.WriteLine(message.ToString());

                    await Task.Delay(3000);
                }

                await endpointInstance.Stop()
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }

    public class Person : IEvent
    {
        public long Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }

        public static Person Generate()
        {
            return new Person
            {
                Id = Math.Abs(Guid.NewGuid().GetHashCode()),
                Firstname = MakeString(),
                Lastname = MakeString()
        };
        }

        public override string ToString()
        {
            return $"{Id} || {Firstname} || {Lastname}";
        }

        private static string MakeString()
        {
            var builder = new StringBuilder();
            Enumerable
                .Range(65, 26)
                .Select(e => ((char)e).ToString())
                .Concat(Enumerable.Range(97, 26).Select(e => ((char)e).ToString()))
                .Concat(Enumerable.Range(0, 10).Select(e => e.ToString()))
                .OrderBy(e => Guid.NewGuid())
                .Take(10)
                .ToList().ForEach(e => builder.Append(e));
            return builder.ToString();
        }
    }
}
